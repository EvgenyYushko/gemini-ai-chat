// Импортируем необходимые классы из библиотеки Google GenAI
import { GoogleGenAI, Chat } from "@google/genai";

// Получаем API-ключ из переменных окружения.
// Переменные окружения — это безопасный способ хранить секретные данные,
// такие как ключи API, не вставляя их напрямую в код.
// В Vite мы настроили доступ к process.env в файле vite.config.ts.
const apiKey = process.env.API_KEY;

// Проверяем, был ли предоставлен API-ключ.
if (!apiKey) {
  // Если ключ отсутствует, выбрасываем ошибку, чтобы предотвратить запуск приложения
  // без необходимой конфигурации.
  throw new Error("API_KEY not found. Please set the API_KEY environment variable.");
}

// Создаем экземпляр клиента GoogleGenAI, передавая ему наш API-ключ.
// Этот объект будет использоваться для всех взаимодействий с Gemini API.
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
