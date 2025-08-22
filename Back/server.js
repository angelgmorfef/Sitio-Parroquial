// Importa las librerías y el modelo de usuario
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User'); // Importa el modelo de usuario

// La cadena de conexión a tu base de datos de MongoDB Atlas
const uri = "mongodb+srv://angelmorfefernandes:Hangel0412@cluster0.s0ecbei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Crea la aplicación de Express
const app = express();
const PORT = 3000;

// Middleware para que el servidor pueda leer datos en formato JSON
app.use(express.json()); 

// Función para conectar a la base de datos y luego iniciar el servidor
async function startServer() {
    try {
        // Conecta a la base de datos de MongoDB Atlas
        await mongoose.connect(uri);
        console.log("✅ Conectado exitosamente a la base de datos de MongoDB Atlas.");

        // Sirve los archivos estáticos desde la carpeta 'frontend'
        app.use(express.static(path.join(__dirname, '../frontend')));

        // Define una ruta para la página de inicio
        app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
        });

        // ======================================
        // ======= NUEVA RUTA DE REGISTRO =======
        // ======================================
        app.post('/register', async (req, res) => {
            try {
                // Obtiene los datos del cuerpo de la petición
                const { username, password } = req.body;

                // Crea un nuevo usuario
                const newUser = new User({ username, password });
                await newUser.save(); // Guarda el usuario en la base de datos

                res.status(201).send('¡Usuario registrado con éxito!');

            } catch (error) {
                res.status(400).send('Error al registrar el usuario: ' + error.message);
            }
        });

        // Inicia el servidor solo después de haberse conectado
        app.listen(PORT, () => {
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });

    } catch (e) {
        console.error("❌ Error al conectar a la base de datos:", e);
    }
}

// Llama a la función para iniciar el proceso
startServer();