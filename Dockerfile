# --- Этап 1: Сборка React-приложения ---
FROM node:20-alpine AS build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все остальные файлы проекта
COPY . .

# Собираем приложение для production
RUN npm run build

# --- Этап 2: Настройка Nginx для раздачи статики ---
FROM nginx:1.25-alpine

# Копируем собранные файлы из первого этапа в директорию Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем файл конфигурации Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем стартовый скрипт
COPY entrypoint.sh /entrypoint.sh

# Устанавливаем утилиту для исправления окончаний строк (важно при разработке на Windows)
# и применяем ее к нашему скрипту
RUN apk add --no-cache dos2unix && dos2unix /entrypoint.sh

# Даем права на выполнение стартовому скрипту
RUN chmod +x /entrypoint.sh

# Открываем порт 80
EXPOSE 80

# Указываем, что наш скрипт должен запускаться при старте контейнера
ENTRYPOINT ["/entrypoint.sh"]
