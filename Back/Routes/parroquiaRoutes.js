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
        
        let user = await User.findOne({ $or: [{ username }, { correo }] });
        if (user) {
            return res.status(400).json({ msg: 'El usuario o el correo ya existen.' });
        }

        user = new User({ nombre, apellido, correo, username, password });
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
                res.json({ token, username: user.username });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error interno del servidor.');
    }
});

// ============== RUTA PROTEGIDA DE EJEMPLO ==============
router.get('/protected', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error interno del servidor.');
    }
});

// ============== RUTA PROTEGIDA PARA OBTENER EL PERFIL DEL USUARIO ==============
router.get('/user/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;