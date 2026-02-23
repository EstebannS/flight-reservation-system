const nodemailer = require('nodemailer');

// Configuración de nodemailer (usando ethereal.email para pruebas)
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'test@ethereal.email', // Cambiar por credenciales reales
    pass: 'testpassword'          // Cambiar por credenciales reales
  }
});

class EmailService {
  async sendConfirmation(email, reservationData) {
    try {
      // Para pruebas, simulamos el envío
      console.log('📧 Simulando envío de email a:', email);
      console.log('Reserva:', reservationData);

      // En un entorno real, enviaríamos el email
      // const info = await transporter.sendMail({
      //   from: '"SkyReserve" <reservas@skyreserve.com>',
      //   to: email,
      //   subject: 'Confirmación de reserva - SkyReserve',
      //   html: this.getEmailTemplate(reservationData)
      // });

      return { success: true };
    } catch (error) {
      console.error('Error enviando email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcome(email, userData) {
    try {
      // Para pruebas, simulamos el envío
      console.log('📧 Simulando envío de email de bienvenida a:', email);
      console.log('Usuario:', userData);

      return { success: true };
    } catch (error) {
      console.error('Error enviando welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendPasswordReset(email, resetLink) {
    try {
      // Para pruebas, simulamos el envío
      console.log('📧 Simulando envío de email de recuperación a:', email);
      console.log('Link de recuperación:', resetLink);

      return { success: true };
    } catch (error) {
      console.error('Error enviando password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  async sendVerification(email, verifyLink) {
    try {
      // Simulación de envío para verificación de cuenta
      console.log('📧 Simulando envío de email de verificación a:', email);
      console.log('Link de verificación:', verifyLink);
      return { success: true };
    } catch (error) {
      console.error('Error enviando verification email:', error);
      return { success: false, error: error.message };
    }
  }

  getEmailTemplate(reservationData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .reservation-code { 
            background: #e5e7eb; 
            padding: 15px; 
            font-size: 24px; 
            text-align: center;
            letter-spacing: 2px;
          }
          .footer { text-align: center; padding: 20px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✈️ SkyReserve</h1>
          </div>
          <div class="content">
            <h2>¡Reserva confirmada!</h2>
            <p>Hola ${reservationData.passengerName},</p>
            <p>Tu reserva ha sido confirmada exitosamente.</p>
            
            <div class="reservation-code">
              Código: ${reservationData.reservationCode}
            </div>
            
            <h3>Detalles del vuelo:</h3>
            <p><strong>Aerolínea:</strong> ${reservationData.airline}</p>
            <p><strong>Vuelo:</strong> ${reservationData.flightNumber}</p>
            <p><strong>Ruta:</strong> ${reservationData.origin} → ${reservationData.destination}</p>
            <p><strong>Fecha:</strong> ${reservationData.date}</p>
            <p><strong>Hora:</strong> ${reservationData.departureTime}</p>
            <p><strong>Total pagado:</strong> $${reservationData.totalAmount.toLocaleString()}</p>
            
            <p>Puedes ver los detalles de tu reserva en nuestra plataforma.</p>
          </div>
          <div class="footer">
            <p>¡Gracias por volar con SkyReserve!</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();