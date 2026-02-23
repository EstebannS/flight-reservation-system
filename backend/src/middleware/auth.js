const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No autorizado - Token no proporcionado'
            });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Verificar que el usuario aún existe
            const user = await User.findById(decoded.id);
            if (!user || !user.is_active) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuario no encontrado o inactivo'
                });
            }

            // Adjuntar usuario a la request
            req.user = user;
            req.userId = user.id;

            next();
        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                error: 'Token inválido o expirado'
            });
        }
    } catch (error) {
        console.error('Error en authenticate:', error);
        res.status(500).json({
            success: false,
            error: 'Error en autenticación'
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'No autorizado'
            });
        }

        // Por ahora solo manejamos roles básicos
        // En el futuro podríamos agregar roles como 'admin'
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};