# ----- ETAPA 1: CONSTRUCCIÓN -----
# Usamos una imagen de Node.js más robusta para instalar las dependencias
FROM node:18-alpine AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de manifiesto del proyecto (package.json y package-lock.json)
# Esto permite que Docker use el cache de la capa para instalar las dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# ----- ETAPA 2: EJECUCIÓN -----
# Usamos una imagen base más pequeña para el entorno de ejecución
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios de la etapa de construcción a esta nueva etapa
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/ .

# Expone el puerto en el que la aplicación escuchará
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD ["node", "server.js"]