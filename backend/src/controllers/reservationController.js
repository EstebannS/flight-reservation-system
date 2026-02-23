const Reservation = require('../models/Reservation');
const Flight = require('../models/Flight');
const User = require('../models/User');
const emailService = require('../services/emailService');
const Joi = require('joi');

const reservationSchema = Joi.object({
  // Accept either numeric id or flight number string
  flightId: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  passengers: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      document: Joi.string().required(),
      type: Joi.string().valid('ADULT', 'CHILD', 'INFANT').default('ADULT'),
      price: Joi.number().required()
    })
  ).min(1).required(),
  totalAmount: Joi.number().required(),
  class: Joi.string().valid('economy', 'premium', 'business', 'first').required(),
  baggage: Joi.string().valid('none', 'light', 'medium', 'heavy', 'extra').required(),
  insurance: Joi.string().valid('none', 'basic', 'premium', 'full').required()
});

class ReservationController {
  // POST /api/reservations
  async create(req, res) {
    try {
      console.log('📝 Creando reserva para usuario:', req.userId);
      console.log('Datos recibidos:', req.body);

      const { error, value } = reservationSchema.validate(req.body);
      if (error) {
        console.log('Error de validación:', error.details[0].message);
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const userId = req.userId;
          const { flightId, passengers, totalAmount, class: flightClass, baggage, insurance } = value;

          // Verificar que el vuelo existe. Allow lookup by numeric id or by flight number.
          let flight = null;
          if (typeof flightId === 'number' || !isNaN(parseInt(flightId))) {
            // try by id first
            const idNum = Number(flightId);
            flight = await Flight.findById(idNum);
          }

          if (!flight) {
            // fallback: try lookup by flight number string
            flight = await Flight.findByFlightNumber(String(flightId));
          }

          if (!flight) {
            return res.status(404).json({
              success: false,
              error: 'Vuelo no encontrado'
            });
          }

      // Crear reserva con detalles adicionales
      const reservation = await Reservation.create(
        userId,
        flightId,
        passengers,
        totalAmount,
        { class: flightClass, baggage, insurance }
      );

      console.log('✅ Reserva creada:', reservation.id);

      res.status(201).json({
        success: true,
        message: 'Reserva creada exitosamente',
        data: reservation
      });
    } catch (error) {
      console.error('❌ Error en create reservation:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear la reserva: ' + error.message
      });
    }
  }

  // GET /api/reservations/my-reservations
  async getMyReservations(req, res) {
    try {
      const userId = req.userId;
      const reservations = await Reservation.findByUser(userId);

      res.json({
        success: true,
        data: reservations
      });
    } catch (error) {
      console.error('Error en getMyReservations:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener reservas'
      });
    }
  }

  // GET /api/reservations/:id
  async getById(req, res) {
    try {
      const { id } = req.params;
      const reservation = await Reservation.findById(id);

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Reserva no encontrada'
        });
      }

      // Verificar que la reserva pertenece al usuario
      if (reservation.user_id !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      res.json({
        success: true,
        data: reservation
      });
    } catch (error) {
      console.error('Error en getById:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener reserva'
      });
    }
  }

  // POST /api/reservations/:id/cancel
  async cancel(req, res) {
    try {
      const { id } = req.params;
      const reservation = await Reservation.findById(id);

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Reserva no encontrada'
        });
      }

      if (reservation.user_id !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      if (reservation.status !== 'PENDING') {
        return res.status(400).json({
          success: false,
          error: 'Solo se pueden cancelar reservas pendientes'
        });
      }

      await reservation.cancel();

      res.json({
        success: true,
        message: 'Reserva cancelada exitosamente'
      });
    } catch (error) {
      console.error('Error en cancel reservation:', error);
      res.status(500).json({
        success: false,
        error: 'Error al cancelar reserva'
      });
    }
  }

  // POST /api/reservations/:id/confirm-payment
  async confirmPayment(req, res) {
    try {
      const { id } = req.params;
      const reservation = await Reservation.findById(id);

      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: 'Reserva no encontrada'
        });
      }

      if (reservation.user_id !== req.userId) {
        return res.status(403).json({
          success: false,
          error: 'No autorizado'
        });
      }

      // Confirmar reserva
      await reservation.confirm();

      // Obtener datos del vuelo para el email
      const flight = await Flight.findById(reservation.flight_id);

      // Enviar email de confirmación
      const user = await User.findById(req.userId);
      await emailService.sendConfirmation(user.email, {
        reservationCode: reservation.reservation_code,
        passengerName: user.full_name,
        airline: flight.airline_name,
        flightNumber: flight.flight_number,
        origin: flight.origin,
        destination: flight.destination,
        date: flight.departure_time,
        departureTime: flight.departure_time,
        totalAmount: reservation.total_amount
      });

      res.json({
        success: true,
        message: 'Pago confirmado exitosamente'
      });
    } catch (error) {
      console.error('Error en confirmPayment:', error);
      res.status(500).json({
        success: false,
        error: 'Error al confirmar el pago'
      });
    }
  }
}

module.exports = new ReservationController();