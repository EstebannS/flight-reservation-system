// Almacén simple de sesiones activas (en producción usar Redis)
const activeSessions = new Map();

const inactivityMiddleware = (minutes = 15) => {
    const timeout = minutes * 60 * 1000; // Convertir a milisegundos

    return (req, res, next) => {
        // Solo aplicar a rutas de compra/checkout
        if (req.path.includes('/payments') || req.path.includes('/checkout')) {
            const token = req.headers.authorization?.split(' ')[1];

            if (token) {
                const lastActivity = activeSessions.get(token) || Date.now();
                const now = Date.now();

                if (now - lastActivity > timeout) {
                    // Sesión expirada por inactividad
                    activeSessions.delete(token);
                    return res.status(401).json({
                        success: false,
                        error: 'Sesión expirada por inactividad',
                        code: 'SESSION_TIMEOUT'
                    });
                }

                // Actualizar última actividad
                activeSessions.set(token, now);
            }
        }

        next();
    };
};

// Middleware para limpiar sesiones (opcional)
const cleanupInactiveSessions = () => {
    const now = Date.now();
    const timeout = 15 * 60 * 1000;

    for (const [token, lastActivity] of activeSessions.entries()) {
        if (now - lastActivity > timeout) {
            activeSessions.delete(token);
        }
    }
};

// Limpiar cada 5 minutos
setInterval(cleanupInactiveSessions, 5 * 60 * 1000);

module.exports = { inactivityMiddleware };