const mongoose = require('mongoose');

// Define el esquema para los usuarios
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false } // Campo para identificar al administrador
});

// Crea el modelo de usuario a partir del esquema
const User = mongoose.model('User', userSchema);

module.exports = User;