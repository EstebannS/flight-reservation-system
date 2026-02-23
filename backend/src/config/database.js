const mysql = require('mysql2');
require('dotenv').config();

// Crear pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flight_reservation',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Promisify para usar async/await
const promisePool = pool.promise();

// Probar conexión
const testConnection = async () => {
    try {
        const [rows] = await promisePool.query('SELECT 1 + 1 AS result');
        console.log('✅ Base de datos conectada correctamente');
        return true;
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error.message);
        return false;
    }
};

module.exports = {
    pool: promisePool,
    testConnection
};