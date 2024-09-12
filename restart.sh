#!/bin/bash

# Останавливаем контейнеры
echo "Stopping containers..."
docker-compose stop backend nginx

# Пересобираем backend и nginx
echo "Rebuilding backend and nginx..."
docker-compose build backend nginx

# Перезапускаем с пересозданием контейнеров
echo "Restarting containers..."
docker-compose up --force-recreate -d backend nginx

# Проверяем статус
echo "Containers status:"
docker-compose ps
