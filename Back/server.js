// Importa las librerías necesarias
const express = require('express');
const path = require('path');

// Crea la aplicación de Express
const app = express();
const PORT = 3000;

// Sirve los archivos estáticos desde la carpeta 'frontend' dentro del contenedor
app.use(express.static(path.join(__dirname, '../frontend')));

// Define una ruta para la página de inicio
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});