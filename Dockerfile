# Этап 1: Сборка React-приложения
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем приложение для production
RUN npm run build

# Этап 2: Настройка Nginx для раздачи статических файлов
FROM nginx:1.25-alpine

# Копируем собранные файлы из этапа 'build'
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем и делаем исполняемым наш стартовый скрипт
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Открываем порт 80
EXPOSE 80

# Устанавливаем стартовый скрипт как точку входа для контейнера
ENTRYPOINT ["/entrypoint.sh"]
