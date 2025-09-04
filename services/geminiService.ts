// Импортируем необходимые классы из библиотеки Google GenAI
import { GoogleGenAI, Chat } from "@google/genai";

// Получаем API-ключ из глобального объекта window, который создается скриптом entrypoint.sh
// const apiKey = import.meta.env.VITE_API_KEY;

const apiKey = 'AIzaSyDCpnSKTcxoceA_cXw1i7MdwLgOArqowq4';

// Теперь вы можете использовать переменную apiKey для ваших запросов
console.log("Мой ключ API:", apiKey);

// Проверяем, был ли ключ предоставлен. Если нет, выбрасываем ошибку.
if (!apiKey) {
  throw new Error("API key is not configured. Please set the VITE_API_KEY environment variable in your hosting service.");
}

// Создаем экземпляр клиента GoogleGenAI, передавая ему API-ключ.
const ai = new GoogleGenAI({ apiKey });

// Экспортируем функцию для создания нового сеанса чата.
export function createChat(): Chat {
  // Используем наш AI-клиент для создания чата с определенной моделью.
  return ai.chats.create({
    // Указываем модель, которую хотим использовать. 'gemini-2.5-flash' — быстрая и эффективная модель.
    model: 'gemini-2.5-flash',
    // 'config' позволяет настроить поведение модели.
    config: {
      // 'systemInstruction' — это системная инструкция или "промпт", который задает
      // первоначальный контекст и роль для AI. Здесь мы просим его быть
      // полезным и дружелюбным ассистентом.
      systemInstruction: 'You are a helpful and friendly AI assistant. Your responses should be informative and well-structured. Use markdown for formatting when appropriate.',
    },
  });
}
