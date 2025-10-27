FROM node:24.4.0 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install -g @angular/cli && npm install

COPY . .
RUN ng build --configuration production

# Etapa 2: servidor Nginx para servir a app
FROM nginx:1.25

# Remove configuração default e copia app
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/OnWayStudy/browser /usr/share/nginx/html

# Config Nginx para Angular SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]