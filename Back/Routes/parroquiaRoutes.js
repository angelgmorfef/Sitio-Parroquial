const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const protect = require('../authMiddleware'); 

// ============== RUTA DE REGISTRO ==============
router.post('/register', async (req, res) => {
    try {
        const { nombre, apellido, correo, username, password } = req.body;
        
        // Verifica si el usuario o el correo ya existen
        let user = await User.findOne({ $or: [{ username }, { correo }] });
        if (user) {
            return res.status(400).json({ msg: 'El usuario o el correo ya existen.' });
        }

        // Crea una instancia del nuevo usuario con todos los campos
        user = new User({ nombre, apellido, correo, username, password });

        // La contraseña se encripta y el usuario se guarda gracias al middleware 'pre' en el modelo User.js
        await user.save();
        
        res.status(201).json({ msg: '¡Usuario registrado con éxito!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error interno del servidor.');
    }
});

// ============== RUTA DE LOGIN ==============
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                // Ahora enviamos el nombre de usuario junto con el token
                res.json({ token, username: user.username });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error interno del servidor.');
    }
});

// ============== RUTA PROTEGIDA DE EJEMPLO ==============
router.get('/api/protected', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error interno del servidor.');
    }
});

module.exports = router;

// ============== RUTA PROTEGIDA PARA OBTENER EL PERFIL DEL USUARIO ==============
router.get('/api/user/profile', protect, async (req, res) => {
    try {
        // 'req.user.id' viene del middleware 'protect'
        // Buscamos al usuario en la base de datos excluyendo la contraseña
        const user = await User.findById(req.user.id).select('-password');
        
        // Si no se encuentra el usuario, enviamos un error 404
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        // Enviamos la información del usuario como respuesta
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
});