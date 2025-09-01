// Back/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env' }); // Agregué el path para asegurar que encuentre el archivo .env

const protect = (req, res, next) => {
    // 1. Obtén el encabezado completo 'Authorization'
    const authHeader = req.header('Authorization');

    // 2. Si no hay encabezado, deniega la autorización
    if (!authHeader) {
        console.error('Error de autorización: No hay encabezado de autorización.');
        return res.status(401).json({ msg: 'No hay token, autorización denegada.' });
    }

    // 3. Extrae el token de la cadena "Bearer <token>"
    const token = authHeader.replace('Bearer ', '');
    
    // 4. Si el token extraído está vacío, deniega
    if (!token) {
        console.error('Error de autorización: El token está vacío.');
        return res.status(401).json({ msg: 'Token no es válido.' });
    }

    // Muestra el token recibido para la depuración
    console.log('Token recibido:', token);
    
    try {
        // 5. Verifica el token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Muestra el contenido del token decodificado para la depuración
        console.log('Token decodificado:', decoded);
        
        // Asigna la información del usuario a la petición
        req.user = decoded.user;
        next(); // Continúa al siguiente middleware o a la ruta
    } catch (e) {
        // Muestra el error exacto de la verificación del token
        console.error('Error de verificación del token:', e.message);
        res.status(401).json({ msg: 'El token no es válido.' });
    }
};

module.exports = protect;