// Импортируем хуки React для управления состоянием (useState), жизненным циклом (useEffect, useCallback) и ссылками на DOM-элементы (useRef).
import { useState, useEffect, useRef, useCallback } from 'react';
// Импортируем типы из библиотеки @google/genai для строгой типизации.
import type { Chat } from '@google/genai';
// Импортируем нашу функцию для создания чата.
import { createChat } from './services/geminiService';
// Импортируем наш тип для сообщений.
import type { Message } from './types';
// Импортируем дочерние компоненты.
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

// Главный компонент приложения.
function App() {

  const apiKey = import.meta.env.VITE_API_KEY;

  // Теперь вы можете использовать переменную apiKey для ваших запросов
  console.log("Мой ключ API:", apiKey);
  
  // Управление состоянием с помощью хуков useState.
  // 'chat' хранит объект сеанса чата с Gemini API.
  const [chat, setChat] = useState<Chat | null>(null);
  // 'messages' — это массив всех сообщений в текущем чате.
  const [messages, setMessages] = useState<Message[]>([]);
  // 'isLoading' — это флаг, который показывает, ждем ли мы ответа от AI.
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // 'error' хранит текст ошибки, если что-то пошло не так.
  const [error, setError] = useState<string | null>(null);
  
  // useRef для получения ссылки на DOM-элемент в конце списка сообщений.
  // Это нужно для автоматической прокрутки вниз при появлении нового сообщения.
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Функция для инициализации нового чата.
  // useCallback используется для мемоизации функции, чтобы она не создавалась заново при каждом рендере.
  const initializeChat = useCallback(() => {
    try {
      // Создаем новый чат с помощью нашего сервиса.
      const newChat = createChat();
      setChat(newChat);
      // Устанавливаем приветственное сообщение от модели.
      setMessages([
        {
          role: 'model',
          text: 'Hello! How can I assist you today?',
        },
      ]);
      setError(null); // Сбрасываем предыдущие ошибки.
    } catch (e: any) {
      // В случае ошибки при инициализации, сохраняем сообщение об ошибке.
      setError(e.message || 'Failed to initialize chat.');
      console.error(e);
    }
  }, []);

  // useEffect для выполнения кода при монтировании компонента.
  // Пустой массив зависимостей [] означает, что этот код выполнится только один раз.
  useEffect(() => {
    initializeChat();
  }, [initializeChat]); // initializeChat включен в зависимости, но т.к. он обернут в useCallback, он не меняется.

  // useEffect для автоматической прокрутки чата вниз.
  // Этот код будет выполняться каждый раз, когда массив `messages` изменяется.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Асинхронная функция для отправки сообщения пользователя.
  const handleSendMessage = async (userMessageText: string) => {
    // Проверяем, не идет ли уже загрузка, не пуст ли текст и инициализирован ли чат.
    if (isLoading || !userMessageText.trim() || !chat) return;

    setIsLoading(true); // Устанавливаем флаг загрузки.
    setError(null); // Сбрасываем ошибки.

    // Добавляем сообщение пользователя в массив сообщений.
    const updatedMessages: Message[] = [
        ...messages,
        { role: 'user', text: userMessageText },
    ];
    setMessages(updatedMessages);

    try {
      // Отправляем сообщение в Gemini API и получаем стриминговый (потоковый) ответ.
      const stream = await chat.sendMessageStream({ message: userMessageText });

      let modelResponse = ''; // Переменная для накопления ответа модели.
      // Добавляем пустое сообщение от модели, которое будем постепенно заполнять.
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      // Итерируемся по частям (чанкам) данных, приходящих из стрима.
      for await (const chunk of stream) {
        modelResponse += chunk.text; // Добавляем текст из чанка к общему ответу.
        // Обновляем последнее сообщение в состоянии, добавляя новый текст.
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = modelResponse;
          return newMessages;
        });
      }

    } catch (e: any) {
      // В случае ошибки при общении с API, сохраняем ошибку.
      const errorMessage = e.message || 'An error occurred while fetching the response.';
      setError(errorMessage);
      // Добавляем сообщение об ошибке в чат.
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${errorMessage}` }]);
      console.error(e);
    } finally {
      // Вне зависимости от успеха или ошибки, убираем флаг загрузки.
      setIsLoading(false);
    }
  };

  // Функция для начала нового чата.
  const handleNewChat = () => {
    setMessages([]); // Очищаем массив сообщений.
    initializeChat(); // Инициализируем новый сеанс чата.
  };

  // JSX разметка компонента.
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {/* Шапка приложения */}
      <header className="bg-gray-800/50 backdrop-blur-sm p-4 flex justify-between items-center border-b border-gray-700 shadow-lg sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-200">Gemini AI Chat</h1>
        <button
          onClick={handleNewChat}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-colors"
        >
          New Chat
        </button>
      </header>

      {/* Основная часть с сообщениями чата */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="max-w-4xl mx-auto">
          {/* Отображаем каждое сообщение из массива `messages` с помощью компонента ChatMessage */}
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          {/* Пустой div, на который мы ссылаемся для автопрокрутки */}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Подвал с полем ввода */}
      <footer className="bg-gray-800/50 backdrop-blur-sm p-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          {/* Показываем ошибку, если она есть */}
          {error && <p className="text-red-400 text-center text-sm mb-2">{error}</p>}
          {/* Компонент для ввода сообщения */}
          <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
      </footer>
    </div>
  );
}

export default App;
