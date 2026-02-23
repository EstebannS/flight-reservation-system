const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de BD
const { testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const flightRoutes = require('./routes/flightRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/reservations', reservationRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '✈️ API Sistema de Reserva de Vuelos',
    version: '1.0.0',
    status: 'online',
    endpoints: {
      auth: '/api/auth',
      flights: '/api/flights',
      reservations: '/api/reservations'
    }
  });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a BD
    const dbConnected = await testConnection();

    app.listen(PORT, () => {
      console.log(`
    ┌─────────────────────────────────────┐
    │   ✈️  SERVIDOR DE VUELOS ACTIVO     │
    ├─────────────────────────────────────┤
    │   Puerto: ${PORT}                        
    │   BD: ${dbConnected ? '✅ Conectada' : '❌ Desconectada'}                
    │   Modo: ${process.env.NODE_ENV || 'development'}                
    │   URL: http://localhost:${PORT}              
    └─────────────────────────────────────┘
      `);
    });
  } catch (error) {
    console.error('Error al iniciar servidor:', error);
  }
};

startServer();