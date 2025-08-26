// Importa las librerías y el modelo de usuario
const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User'); // Importa el modelo de usuario

// La cadena de conexión a tu base de datos de MongoDB Atlas
const uri = "mongodb+srv://angelmorfefernandes:Hangel0412@cluster0.s0ecbei.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const jwtSecret = 'tu_clave_secreta_super_segura_aqui';

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
        // ======= RUTA DE REGISTRO =======
        // ======================================
        app.post('/register', async (req, res) => {
            try {
                // Obtiene los datos del cuerpo de la petición
                const { username, password } = req.body;

                // Crea un nuevo usuario
                const newUser = new User({ username, password });
                await newUser.save(); // Guarda el usuario en la base de datos

                res.status(201).json({ message: '¡Usuario registrado con éxito!' });

            } catch (error) {
                // Envía el error en formato JSON
                res.status(400).json({ error: 'Error al registrar el usuario: ' + error.message });
            }
        });

        // ======================================
        // ========= RUTA DE LOGIN ========
        // ======================================
        app.post('/login', async (req, res) => {
            try {
                const { email, password } = req.body;
                const user = await User.findOne({ username: email });
            
                if (!user || user.password !== password) {
                    // Envía el error en formato JSON
                    return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
                }
            
                // Si el usuario existe y la contraseña es correcta, crea un payload para el token
                const payload = {
                    id: user._id,
                    username: user.username
                };
            
                // Genera el token usando la clave secreta
                const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
            
                // Envía el token al frontend
                res.status(200).json({ token: token });
            
            } catch (error) {
                // Envía el error interno en formato JSON
                res.status(500).json({ error: 'Error interno del servidor.' });
                console.error('Error al intentar iniciar sesión:', error);
            }
        });

        // ======================================
        // ======= MIDDLEWARE DE AUTENTICACIÓN =======
        // Este middleware verifica si el token es válido
        // ======================================
        function verifyToken(req, res, next) {
            // Obtiene el token del encabezado 'Authorization'
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (token == null) return res.sendStatus(401); // Si no hay token, devuelve 'No autorizado'

            jwt.verify(token, jwtSecret, (err, user) => {
                if (err) return res.sendStatus(403); // Si el token no es válido, devuelve 'Acceso prohibido'
                req.user = user; // Almacena los datos del usuario en la solicitud
                next(); // Continúa con la siguiente función
            });
        }
        
        // ======================================
        // ======== RUTA PROTEGIDA DE EJEMPLO ========
        // Esta ruta solo se puede acceder con un token válido
        // ======================================
        app.get('/api/protected', verifyToken, (req, res) => {
            // Si llegas aquí, significa que el token es válido
            res.json({ message: `¡Hola ${req.user.username}! Bienvenido a la sección privada. Tu ID de usuario es ${req.user.id}` });
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