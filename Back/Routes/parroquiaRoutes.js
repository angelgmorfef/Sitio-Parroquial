const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de que esta ruta sea correcta
const jwt = require('jsonwebtoken');

// Clave secreta para JWT (la moveremos al archivo .env más tarde)
const jwtSecret = 'tu_clave_secreta_super_segura_aqui';

// Middleware de autenticación (lo movemos aquí también)
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// ============== RUTA DE REGISTRO ==============
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: '¡Usuario registrado con éxito!' });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el usuario: ' + error.message });
    }
});

// ============== RUTA DE LOGIN ==============
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ username: email });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
        }

        const payload = {
            id: user._id,
            username: user.username
        };

        const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
        res.status(200).json({ token: token });

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
        console.error('Error al intentar iniciar sesión:', error);
    }
});

// ============== RUTA PROTEGIDA DE EJEMPLO ==============
router.get('/api/protected', verifyToken, (req, res) => {
    res.json({ message: `¡Hola ${req.user.username}! Bienvenido a la sección privada. Tu ID de usuario es ${req.user.id}` });
});

module.exports = router;