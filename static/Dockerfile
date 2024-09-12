# Dockerfile for static file server

FROM nginx:alpine

COPY ./files /usr/share/nginx/html/static

# Копируем конфигурацию Nginx
COPY ./nginx-static.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
