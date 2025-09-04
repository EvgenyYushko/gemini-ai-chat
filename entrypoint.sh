#!/bin/sh

exec nginx -g 'daemon off;'

# Путь к файлу, который мы будем создавать
#ENV_JS_FILE=/usr/share/nginx/html/env.js

# Сначала создаем пустой объект, чтобы приложение не падало, если ключ не найден
#echo "window.env = {};" > $ENV_JS_FILE

# Проверяем, существует ли переменная окружения API_KEY
#if [ -n "$API_KEY" ]; then
#  # Если да, дописываем ключ в наш файл
#  echo "window.env.API_KEY = \"${API_KEY}\";" >> $ENV_JS_FILE
#  echo "Entrypoint: API_KEY has been injected into env.js"
#else
#  # Если нет, выводим предупреждение в логи
#  echo "Entrypoint: Warning! API_KEY environment variable not set."
#fi

# Эта команда запускает Nginx и оставляет его работать на переднем плане.
# Это необходимо, чтобы контейнер не завершил свою работу сразу после запуска скрипта.
#exec nginx -g 'daemon off;'

