# Указываем базовый образ Node.js 20
FROM node:20-alpine

# Устанавливаем рабочую директорию в контейнере
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (если есть)
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --only=production

# Копируем остальные файлы проекта
COPY . .

# Устанавливаем глобально ts-node и typescript
RUN npm install -g ts-node

ENV NODE_ENV=production

# Указываем порт, на котором будет работать сервер
EXPOSE 8000

# Указываем команду для запуска приложения
CMD ["ts-node", "app/main.ts"]


