# Этап 1: Сборка (Build)
FROM node:20-alpine as build

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Собираем проект (создается папка dist)
RUN npm run build

# Этап 2: Запуск (Serve)
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа в папку Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем наш конфиг Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]