# Используем официальный образ Nginx
FROM nginx:alpine

# Копируем конфигурацию Nginx в контейнер
COPY nginx.conf /etc/nginx/nginx.conf

# Копируем папку с файлами в директорию для сервировки
COPY files/ /usr/share/nginx/static
