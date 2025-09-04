// Импортируем функцию defineConfig из Vite для создания конфигурации с подсказками типов
import { defineConfig } from 'vite'
// Импортируем плагин для поддержки React в Vite
import react from '@vitejs/plugin-react'

// Экспортируем конфигурацию Vite
export default defineConfig({
  // Список плагинов, которые будет использовать Vite. В данном случае, только плагин для React.
  plugins: [react()],
})
