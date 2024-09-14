# Используем официальный образ PostgreSQL
FROM postgres:15-alpine

EXPOSE 5432

# Копируем дамп базы данных в папку инициализации PostgreSQL
COPY ./init-db.sql /docker-entrypoint-initdb.d/