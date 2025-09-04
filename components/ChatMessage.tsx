import React from 'react';
import type { Message } from '../types'; // Импортируем тип сообщения
import UserIcon from './icons/UserIcon'; // Иконка пользователя
import GeminiIcon from './icons/GeminiIcon'; // Иконка AI

// Определяем пропсы (props) для компонента. Он ожидает получить один объект 'message'.
interface ChatMessageProps {
  message: Message;
}

// Компонент для отображения одного сообщения в чате.
const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Определяем, является ли отправитель сообщения пользователем.
  const isUser = message.role === 'user';

  // Функция для форматирования текста. Поддерживает базовый markdown.
  const formatText = (text: string) => {
    // Заменяем **текст** на <strong>текст</strong> (жирный шрифт).
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Заменяем `код` на <code class="...">код</code> (блок кода).
      .replace(/`([^`]+)`/g, '<code class="bg-black/50 px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Заменяем переносы строк (\n) на HTML-тег <br />, чтобы они отображались в браузере.
    formattedText = formattedText.replace(/\n/g, '<br />');

    // Возвращаем объект, который можно использовать с dangerouslySetInnerHTML.
    // Это необходимо для вставки HTML-разметки в элемент.
    return { __html: formattedText };
  };

  return (
    // Контейнер для сообщения. `animate-fade-in` добавляет анимацию появления.
    <div className={`flex items-start gap-4 my-4 animate-fade-in`}>
      {/* Контейнер для иконки-аватара */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isUser ? 'bg-blue-600' : 'bg-gray-600'}`}>
        {/* В зависимости от роли, показываем иконку пользователя или AI */}
        {isUser ? <UserIcon /> : <GeminiIcon />}
      </div>
      {/* Контейнер для текста сообщения */}
      <div className={`w-full max-w-full overflow-x-auto rounded-lg p-4 text-gray-200 ${isUser ? 'bg-blue-900/50' : 'bg-gray-700/50'}`}>
        {/*
          Используем dangerouslySetInnerHTML для вставки отформатированного HTML.
          Это считается "опасным", так как может привести к XSS-атакам, если HTML
          приходит из недоверенного источника. В нашем случае мы сами форматируем
          текст, поэтому это безопасно.
        */}
        <div
          className="prose prose-invert prose-sm max-w-none"
          dangerouslySetInnerHTML={formatText(message.text)}
        />
      </div>
    </div>
  );
};

export default ChatMessage;
