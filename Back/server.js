require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors'); // Importa el middleware de CORS
const path = require('path');
const mongoose = require('mongoose');

// Importa las rutas
const parroquiaRoutes = require('./Routes/parroquiaRoutes');
const eventRoutes = require('./Routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar datos JSON
app.use(express.json());
app.use(cors()); // Usa el middleware de CORS aquí

// Función asíncrona para iniciar el servidor
async function startServer() {
    try {
        // Conecta a la base de datos de MongoDB Atlas usando la variable de entorno
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Conectado exitosamente a la base de datos de MongoDB Atlas.");

        // Sirve los archivos estáticos (Front)
        app.use(express.static(path.join(__dirname, '../Front')));
        
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../Front', 'index.html'));
        });

        // Usa el router para todas las rutas de la API
        app.use('/api', parroquiaRoutes);
        app.use('/api/events', eventRoutes);

        // Inicia el servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (e) {
        console.error("❌ Error al conectar a la base de datos:", e);
    }
}

// Llama a la función para iniciar el servidor
startServer();