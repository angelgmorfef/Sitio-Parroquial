// Importa las librerías necesarias para el servidor web y la base de datos
const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');

// La cadena de conexión a tu base de datos de MongoDB Atlas
// ¡Recuerda reemplazar <username> y <password> con tus datos reales!
const uri = "mongodb+srv://angelmorfefernandes:Hangel0412@cluster0.s0ecbei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Crea la aplicación de Express
const app = express();
const PORT = 3000;

// Esta función conecta a la base de datos y luego inicia el servidor
async function startServer() {
    const client = new MongoClient(uri);

    try {
        // Conecta a la base de datos
        await client.connect();
        console.log("✅ Conectado exitosamente a la base de datos de MongoDB Atlas.");

        // Sirve los archivos estáticos desde la carpeta 'frontend'
        app.use(express.static(path.join(__dirname, '../frontend')));

        // Define una ruta para la página de inicio
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
        });

        // Inicia el servidor solo después de haberse conectado a la base de datos
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (e) {
        console.error("❌ Error al conectar a la base de datos:", e);
    }
}

// Llama a la función para iniciar el proceso
startServer();