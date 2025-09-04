#!/bin/sh

# Устанавливаем путь для файла конфигурации в корневой папке Nginx
ENV_JS_FILE=/usr/share/nginx/html/env.js

# Создаем пустой файл, чтобы избежать ошибок, если переменная не установлена
echo "window.env = {};" > $ENV_JS_FILE

# Проверяем, установлена ли переменная API_KEY
if [ -n "$API_KEY" ]; then
  # Если да, создаем файл env.js и записываем в него ключ
  echo "window.env.API_KEY = \"${API_KEY}\";" >> $ENV_JS_FILE
  echo "API_KEY has been set."
else
  # Если нет, выводим предупреждение в логи
  echo "Warning: API_KEY environment variable is not set."
fi

# Эта команда запускает Nginx и держит его на переднем плане,
# что необходимо для работы контейнера.
exec nginx -g 'daemon off;'
