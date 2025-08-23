FROM node:24.4.0 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install -g @angular/cli && npm install

COPY . .
RUN ng build --configuration production

FROM nginx:1.25

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/meu-projeto /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
