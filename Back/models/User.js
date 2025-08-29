const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true // Asegura que cada nombre de usuario sea único
  },
  password: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true // Asegura que cada correo sea único
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Método para encriptar la contraseña antes de guardar el usuario
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);