const { pool } = require('../config/database');

class Flight {
    constructor(data = {}) {
        this.id = data.id;
        this.airline_id = data.airline_id;
        this.airline_name = data.airline_name;
        this.airline_code = data.airline_code;
        this.flight_number = data.flight_number;
        this.origin = data.origin;
        this.destination = data.destination;
        this.departure_time = data.departure_time;
        this.arrival_time = data.arrival_time;
        this.duration_minutes = data.duration_minutes;
        this.aircraft_type = data.aircraft_type;
        this.total_seats = data.total_seats || 150;
        this.base_price = data.base_price;
        this.status = data.status || 'ON_TIME';
    }

    // Buscar vuelos por ruta y fecha
    static async findByRoute(origin, destination, date) {
        try {
            const query = `
        SELECT f.*, a.name as airline_name, a.code as airline_code, a.logo_url
        FROM flights f
        JOIN airlines a ON f.airline_id = a.id
        WHERE f.origin = ? 
          AND f.destination = ?
          AND DATE(f.departure_time) = ?
          AND f.status != 'CANCELLED'
        ORDER BY f.departure_time ASC
      `;

            const [rows] = await pool.execute(query, [origin, destination, date]);
            return rows.map(row => new Flight(row));
        } catch (error) {
            console.error('Error en Flight.findByRoute:', error);
            throw error;
        }
    }

    // Buscar vuelo por ID
    static async findById(id) {
        try {
            const query = `
        SELECT f.*, a.name as airline_name, a.code as airline_code
        FROM flights f
        JOIN airlines a ON f.airline_id = a.id
        WHERE f.id = ?
      `;
            const [rows] = await pool.execute(query, [id]);
            return rows.length ? new Flight(rows[0]) : null;
        } catch (error) {
            console.error('Error en Flight.findById:', error);
            throw error;
        }
    }

    // Buscar vuelo por número de vuelo
    static async findByFlightNumber(flightNumber) {
        try {
            const query = `
        SELECT f.*, a.name as airline_name, a.code as airline_code
        FROM flights f
        JOIN airlines a ON f.airline_id = a.id
        WHERE f.flight_number = ?
      `;
            const [rows] = await pool.execute(query, [flightNumber]);
            return rows.length ? new Flight(rows[0]) : null;
        } catch (error) {
            console.error('Error en Flight.findByFlightNumber:', error);
            throw error;
        }
    }

    // Buscar vuelos por destino (tarifas)
    static async findFares(origin, destination) {
        try {
            const query = `
        SELECT f.*, a.name as airline_name, a.code as airline_code
        FROM flights f
        JOIN airlines a ON f.airline_id = a.id
        WHERE f.origin = ? 
          AND f.destination = ?
          AND f.departure_time > NOW()
          AND f.status != 'CANCELLED'
        ORDER BY f.base_price ASC
      `;

            const [rows] = await pool.execute(query, [origin, destination]);
            return rows.map(row => new Flight(row));
        } catch (error) {
            console.error('Error en Flight.findFares:', error);
            throw error;
        }
    }

    // Calcular duración del vuelo
    calculateDuration() {
        if (this.duration_minutes) return this.duration_minutes;

        const diff = new Date(this.arrival_time) - new Date(this.departure_time);
        return Math.floor(diff / (1000 * 60));
    }

    // Verificar asientos disponibles
    async checkAvailability() {
        try {
            const [rows] = await pool.execute(
                'SELECT COUNT(*) as available FROM seats WHERE flight_id = ? AND is_available = true',
                [this.id]
            );
            return rows[0].available;
        } catch (error) {
            console.error('Error en checkAvailability:', error);
            return 0;
        }
    }

    // Obtener asientos disponibles
    async getAvailableSeats(class_type = null) {
        try {
            let query = 'SELECT * FROM seats WHERE flight_id = ? AND is_available = true';
            const params = [this.id];

            if (class_type) {
                query += ' AND class = ?';
                params.push(class_type);
            }

            query += ' ORDER BY seat_number';

            const [rows] = await pool.execute(query, params);
            return rows;
        } catch (error) {
            console.error('Error en getAvailableSeats:', error);
            return [];
        }
    }

    // Formatear para respuesta
    toJSON() {
        return {
            id: this.id,
            airline: {
                id: this.airline_id,
                name: this.airline_name,
                code: this.airline_code
            },
            flightNumber: this.flight_number,
            origin: this.origin,
            destination: this.destination,
            departure: this.departure_time,
            arrival: this.arrival_time,
            duration: this.calculateDuration(),
            price: this.base_price,
            status: this.status,
            aircraft: this.aircraft_type
        };
    }
}

module.exports = Flight;