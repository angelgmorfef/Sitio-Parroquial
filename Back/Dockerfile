# Usa una imagen base de Node.js
FROM node:22-alpine

# Establece el directorio de trabajo en la raíz de la aplicación
WORKDIR /app

# Copia las carpetas del backend y del frontend
# Esto copiará tanto el código del servidor como los archivos web
COPY Back ./backend
COPY Front ./frontend

# Establece el directorio de trabajo para instalar las dependencias
WORKDIR /app/backend

# Instala todas las dependencias del proyecto
RUN npm install

# Expone el puerto que la aplicación escuchará
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor arranque
CMD ["node", "server.js"]