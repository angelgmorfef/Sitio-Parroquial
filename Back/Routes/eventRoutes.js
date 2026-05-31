const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// ============== OBTENER TODOS LOS EVENTOS ==============
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1, time: 1 });
        res.json(events);
    } catch (error) {
        console.error('Error al obtener eventos:', error.message);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
});

// ============== CREAR UN NUEVO EVENTO ==============
router.post('/', async (req, res) => {
    try {
        const { title, date, time, description } = req.body;
        
        if (!title || !date || !time || !description) {
            return res.status(400).json({ msg: 'Por favor, complete todos los campos obligatorios.' });
        }

        const newEvent = new Event({ title, date, time, description });
        const savedEvent = await newEvent.save();
        
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error('Error al crear evento:', error.message);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
});

// ============== ELIMINAR UN EVENTO ==============
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return res.status(404).json({ msg: 'Evento no encontrado' });
        }

        await event.deleteOne();
        res.json({ msg: 'Evento eliminado' });
    } catch (error) {
        console.error('Error al eliminar evento:', error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Evento no encontrado' });
        }
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
});

module.exports = router;
