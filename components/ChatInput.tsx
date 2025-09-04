import React, { useState, useRef, useEffect } from 'react';
import SendIcon from './icons/SendIcon'; // Иконка отправки

// Определяем пропсы для компонента.
interface ChatInputProps {
  onSendMessage: (message: string) => void; // Функция обратного вызова для отправки сообщения.
  isLoading: boolean; // Флаг, указывающий, идет ли загрузка.
}

// Компонент поля ввода сообщения.
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  // Состояние для хранения текста, введенного пользователем.
  const [message, setMessage] = useState('');
  // Ссылка на DOM-элемент textarea для прямого доступа к нему.
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // useEffect для автоматического изменения высоты textarea в зависимости от содержимого.
  // Запускается каждый раз, когда изменяется 'message'.
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Сначала сбрасываем высоту.
      const scrollHeight = textareaRef.current.scrollHeight; // Вычисляем высоту контента.
      textareaRef.current.style.height = `${scrollHeight}px`; // Устанавливаем новую высоту.
    }
  }, [message]);

  // Обработчик отправки формы.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы (перезагрузку страницы).
    if (message.trim()) { // Если сообщение не пустое (после удаления пробелов)
      onSendMessage(message); // Вызываем функцию обратного вызова из родительского компонента.
      setMessage(''); // Очищаем поле ввода.
    }
  };

  // Обработчик нажатия клавиш в textarea.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Если нажат Enter и при этом не зажат Shift (для переноса строки)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Предотвращаем вставку новой строки.
      handleSubmit(e as any); // Отправляем форму.
    }
  };

  return (
    // Форма оборачивает поле ввода и кнопку.
    <form onSubmit={handleSubmit} className="flex items-end gap-3 bg-gray-700/50 p-2 rounded-xl border border-gray-600">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)} // Обновляем состояние при каждом изменении.
        onKeyDown={handleKeyDown} // Обрабатываем нажатия клавиш.
        placeholder="Type your message here..."
        className="flex-1 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none resize-none px-2 py-2 max-h-40"
        rows={1} // Начальная высота в одну строку.
        disabled={isLoading} // Блокируем поле ввода во время загрузки.
      />
      <button
        type="submit"
        disabled={isLoading || !message.trim()} // Кнопка неактивна во время загрузки или если поле пустое.
        className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full text-white disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 flex-shrink-0"
      >
        {isLoading ? (
          // Если идет загрузка, показываем спиннер (анимацию вращения).
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        ) : (
          // В обычном состоянии показываем иконку отправки.
          <SendIcon />
        )}
      </button>
    </form>
  );
};

export default ChatInput;
