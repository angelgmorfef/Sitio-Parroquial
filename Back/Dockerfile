# Usa una imagen base de Node.js
FROM node:22-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app/backend

# Copia los archivos de configuración de npm
# Esto permite a Docker usar el caché de la capa de npm install
COPY package*.json ./

# Instala todas las dependencias del proyecto (incluyendo jsonwebtoken)
# Este comando lee el package.json y descarga todo lo que necesita
RUN npm install

# Copia el resto del código fuente a la imagen
COPY . .

# Expone el puerto que la aplicación escuchará
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor arranque
CMD ["node", "server.js"]