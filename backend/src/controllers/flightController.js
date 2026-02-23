const Flight = require('../models/Flight');
const Joi = require('joi');

const searchSchema = Joi.object({
    origin: Joi.string().length(3).required(),
    destination: Joi.string().length(3).required(),
    date: Joi.date().iso().required()
});

class FlightController {
    // GET /api/flights/search?origin=BOG&destination=MDE&date=2024-03-20
    async search(req, res) {
        try {
            const { error, value } = searchSchema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: 'Parámetros inválidos',
                    details: error.details[0].message
                });
            }

            const flights = await Flight.findByRoute(
                value.origin,
                value.destination,
                value.date
            );

            // Enriquecer con disponibilidad
            const flightsWithAvailability = await Promise.all(
                flights.map(async (flight) => {
                    const available = await flight.checkAvailability();
                    return {
                        ...flight.toJSON(),
                        availableSeats: available
                    };
                })
            );

            res.json({
                success: true,
                count: flightsWithAvailability.length,
                data: flightsWithAvailability
            });
        } catch (error) {
            console.error('Error en search:', error);
            res.status(500).json({
                success: false,
                error: 'Error al buscar vuelos'
            });
        }
    }

    // GET /api/flights/fares?origin=BOG&destination=MDE
    async getFares(req, res) {
        try {
            const { origin, destination } = req.query;

            if (!origin || !destination) {
                return res.status(400).json({
                    success: false,
                    error: 'Origen y destino son requeridos'
                });
            }

            const flights = await Flight.findFares(origin, destination);

            const fares = flights.map(flight => ({
                airline: flight.airline_name,
                flightNumber: flight.flight_number,
                departure: flight.departure_time,
                price: flight.base_price,
                duration: flight.calculateDuration()
            }));

            res.json({
                success: true,
                data: fares
            });
        } catch (error) {
            console.error('Error en getFares:', error);
            res.status(500).json({
                success: false,
                error: 'Error al consultar tarifas'
            });
        }
    }

    // GET /api/flights/:id
    async getById(req, res) {
        try {
            const { id } = req.params;

            const flight = await Flight.findById(id);
            if (!flight) {
                return res.status(404).json({
                    success: false,
                    error: 'Vuelo no encontrado'
                });
            }

            const [availableSeats, seatsByClass] = await Promise.all([
                flight.checkAvailability(),
                flight.getAvailableSeats()
            ]);

            res.json({
                success: true,
                data: {
                    ...flight.toJSON(),
                    availableSeats,
                    seats: seatsByClass
                }
            });
        } catch (error) {
            console.error('Error en getById:', error);
            res.status(500).json({
                success: false,
                error: 'Error al obtener información del vuelo'
            });
        }
    }

    // GET /api/flights/status/:flightNumber
    async getStatus(req, res) {
        try {
            const { flightNumber } = req.params;

            const [rows] = await pool.execute(
                `SELECT f.*, a.name as airline_name 
         FROM flights f
         JOIN airlines a ON f.airline_id = a.id
         WHERE f.flight_number = ? AND DATE(f.departure_time) = CURDATE()
         ORDER BY f.departure_time DESC
         LIMIT 1`,
                [flightNumber]
            );

            if (rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Vuelo no encontrado'
                });
            }

            const flight = new Flight(rows[0]);
            const available = await flight.checkAvailability();

            res.json({
                success: true,
                data: {
                    flightNumber: flight.flight_number,
                    airline: flight.airline_name,
                    origin: flight.origin,
                    destination: flight.destination,
                    departure: flight.departure_time,
                    arrival: flight.arrival_time,
                    status: flight.status,
                    availableSeats: available
                }
            });
        } catch (error) {
            console.error('Error en getStatus:', error);
            res.status(500).json({
                success: false,
                error: 'Error al consultar estado del vuelo'
            });
        }
    }
}

module.exports = new FlightController();