// Импортируем необходимые классы из библиотеки Google GenAI
import { GoogleGenAI, Chat } from "@google/genai";

// Fix: Initialize GoogleGenAI with API key from environment variables as per guidelines.
// Создаем экземпляр клиента GoogleGenAI, передавая ему API-ключ из `process.env.API_KEY`.
// Предполагается, что эта переменная окружения настроена и доступна.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

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
