# Usa la imagen de Node.js que descargaste
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos del backend y del frontend al contenedor
COPY Back /app/backend
COPY Front /app/frontend

# Mueve el directorio de trabajo al backend
WORKDIR /app/backend

# Instala Express.js
RUN npm install express

# Expone el puerto que usará el servidor
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor se inicie
CMD ["node", "server.js"]