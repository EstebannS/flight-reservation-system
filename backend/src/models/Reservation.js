const { pool } = require('../config/database');

class Reservation {
  constructor(data = {}) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.reservation_code = data.reservation_code;
    this.status = data.status || 'PENDING';
    this.total_amount = data.total_amount;
    this.expires_at = data.expires_at;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.extras = data.extras ? (typeof data.extras === 'string' ? JSON.parse(data.extras) : data.extras) : {};
    this.details = data.details || [];
  }

  static async create(userId, flightId, passengerData, totalAmount, extras = {}) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Generar código de reserva (PNR)
      const reservationCode = 'SKY' + Math.random().toString(36).substring(2, 8).toUpperCase();

      // Calcular fecha de expiración (15 minutos)
      const expiresAt = new Date(Date.now() + 15 * 60000);

      // Crear reserva con extras
      const [result] = await connection.execute(
        `INSERT INTO reservations 
         (user_id, reservation_code, status, total_amount, expires_at, extras) 
         VALUES (?, ?, 'PENDING', ?, ?, ?)`,
        [userId, reservationCode, totalAmount, expiresAt, JSON.stringify(extras)]
      );

      const reservationId = result.insertId;

      // Crear detalles de reserva
      for (const passenger of passengerData) {
        await connection.execute(
          `INSERT INTO reservation_details 
           (reservation_id, flight_id, passenger_name, passenger_document, passenger_type, price_at_booking) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [reservationId, flightId, passenger.name, passenger.document, passenger.type || 'ADULT', passenger.price]
        );
      }

      await connection.commit();

      return await Reservation.findById(reservationId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findById(id) {
    try {
      // Get reservation row
      const [rows] = await pool.execute(
        `SELECT * FROM reservations WHERE id = ?`,
        [id]
      );

      if (rows.length === 0) return null;

      const reservationRow = rows[0];

      // Get reservation details separately to avoid JSON functions dependency
      const [detailsRows] = await pool.execute(
        `SELECT id, flight_id, passenger_name, passenger_document, passenger_type, price_at_booking as price
         FROM reservation_details WHERE reservation_id = ?`,
        [id]
      );

      reservationRow.details = detailsRows || [];

      return new Reservation(reservationRow);
    } catch (error) {
      console.error('Error en Reservation.findById:', error);
      throw error;
    }
  }

  static async findByUser(userId) {
    try {
      const [rows] = await pool.execute(
        `SELECT r.*, 
          COUNT(rd.id) as passenger_count,
          f.origin, f.destination, f.departure_time,
          f.flight_number, a.name as airline_name
         FROM reservations r
         LEFT JOIN reservation_details rd ON r.id = rd.reservation_id
         LEFT JOIN flights f ON rd.flight_id = f.id
         LEFT JOIN airlines a ON f.airline_id = a.id
         WHERE r.user_id = ?
         GROUP BY r.id
         ORDER BY r.created_at DESC`,
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error en Reservation.findByUser:', error);
      throw error;
    }
  }

  async confirm() {
    try {
      await pool.execute(
        'UPDATE reservations SET status = "CONFIRMED" WHERE id = ?',
        [this.id]
      );
      this.status = 'CONFIRMED';
      return this;
    } catch (error) {
      console.error('Error en confirm:', error);
      throw error;
    }
  }

  async cancel() {
    try {
      await pool.execute(
        'UPDATE reservations SET status = "CANCELLED" WHERE id = ?',
        [this.id]
      );
      this.status = 'CANCELLED';
      return this;
    } catch (error) {
      console.error('Error en cancel:', error);
      throw error;
    }
  }

  isExpired() {
    return new Date() > new Date(this.expires_at);
  }
}

module.exports = Reservation;