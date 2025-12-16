# --- Etapa 1: Construcción (Node) ---
# Usamos Node 18 (compatible con Angular 15)
FROM node:18-alpine AS build

WORKDIR /app

# Copiamos package.json para instalar dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copiamos el código fuente
COPY . .

# Construimos para producción (Genera la carpeta /dist)
RUN npm run build -- --configuration production

# --- Etapa 2: Servidor Web (Nginx) ---
FROM nginx:alpine

# Copiamos la configuración personalizada de Nginx (ver punto 3 abajo)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados de Angular al directorio de Nginx
# ¡OJO! Reemplaza 'nombre-de-tu-proyecto' con el nombre real que sale en tu angular.json
COPY --from=build /app/dist/Angular-Frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]