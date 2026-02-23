const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Error de validación
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }

    // Error de JWT
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Token inválido'
        });
    }

    // Error por defecto
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
};

module.exports = { errorHandler };