# Этап 1: Сборка фронтенда
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап 2: Запуск сервера
FROM node:20-alpine
WORKDIR /app

# Копируем зависимости
COPY package*.json ./
RUN npm install --production

# Копируем собранный фронтенд из этапа 1
COPY --from=build /app/dist ./dist

# Копируем файл сервера
COPY server.js .

# Создаем папку для базы данных
RUN mkdir data

EXPOSE 3000

# Запускаем сервер
CMD ["node", "server.js"]