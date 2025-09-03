const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const protect = require('../authMiddleware'); 

// ============== RUTA DE REGISTRO ==============
router.post('/register', async (req, res) => {
    try {
        const { nombre, apellido, correo, password } = req.body;
        
        let user = await User.findOne({ correo }); 
        if (user) {
            return res.status(400).json({ msg: 'El correo ya está registrado.' });
        }

        user = new User({ nombre, apellido, correo, password });
        await user.save();
        
        res.status(201).json({ msg: '¡Usuario registrado con éxito!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
});

// ============== RUTA DE LOGIN ==============
router.post('/login', async (req, res) => {
    try {
        const { correo, password } = req.body;
        const user = await User.findOne({ correo });
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
                res.json({ token, username: user.username, email: user.correo });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error interno del servidor.' });
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
        res.status(500).json({ msg: 'Error del servidor' });
    }
});

module.exports = router;