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
        let connected = false;
        const urisToTry = [
            process.env.MONGO_URI,
            'mongodb://db:27017/sitio_parroquial', // Local dentro de Docker
            'mongodb://127.0.0.1:27017/sitio_parroquial' // Local fuera de Docker
        ].filter(Boolean);

        for (const uri of urisToTry) {
            try {
                const safeLogUri = uri.includes('@') ? uri.replace(/\/\/.*@/, '//***:***@') : uri;
                console.log(`Intentando conectar a: ${safeLogUri}`);
                await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
                console.log("✅ Conectado exitosamente a la base de datos.");
                connected = true;
                break;
            } catch (err) {
                console.warn(`⚠️ No se pudo conectar a la base de datos (${uri.split('@').pop()}): ${err.message}`);
            }
        }

        if (!connected) {
            throw new Error("No se pudo establecer conexión con ninguna base de datos de MongoDB.");
        }

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