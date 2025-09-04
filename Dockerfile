# Этап 1: Сборка React-приложения
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости проекта
RUN npm install

# Копируем остальные файлы исходного кода
COPY . .

# Собираем приложение для production. Команда `npm run build` создаст папку `dist`
RUN npm run build

# Этап 2: Настройка Nginx для раздачи статических файлов
FROM nginx:1.25-alpine

# Копируем собранные файлы из этапа 'build' в директорию, которую использует Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем наш кастомный файл конфигурации Nginx
# Убедитесь, что рядом с Dockerfile лежит файл nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Открываем порт 80, чтобы можно было получить доступ к приложению
EXPOSE 80

# Команда для запуска Nginx при старте контейнера
CMD ["nginx", "-g", "daemon off;"]
