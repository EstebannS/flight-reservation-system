const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const emailService = require('../services/emailService');

// Esquemas de validación
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().required(),
  document_type: Joi.string().valid('CC', 'CE', 'PASSPORT').default('CC'),
  document_number: Joi.string().required(),
  phone: Joi.string().allow('').optional(),
  birth_date: Joi.date().max('now').optional().allow(null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

class AuthController {
  // POST /api/auth/register
  async register(req, res) {
    try {
      console.log('Datos recibidos:', req.body); // Para debug

      // Validar datos de entrada
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        console.log('Error de validación:', error.details[0].message);
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      console.log('Datos validados:', value); // Para debug

      // Verificar si el usuario ya existe (incluso inactivo)
      const existingUser = await User.findByEmailIncludeInactive(value.email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'El email ya está registrado'
        });
      }

      // Crear usuario
      const user = await User.create(value);
      console.log('Usuario creado:', user.id); // Para debug

      // Marcar usuario como inactivo hasta verificar correo
      try {
        await user.setActive(false);
      } catch (e) {
        console.error('Error marcando usuario inactivo:', e);
      }

      // Enviar email de verificación (simulado)
      try {
        const tokenVerify = jwt.sign({ id: user.id, purpose: 'verify' }, process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2024', { expiresIn: '24h' });
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const verifyLink = `${frontendUrl}/verify-email?token=${tokenVerify}`;
        await emailService.sendVerification(user.email, verifyLink);
      } catch (e) {
        console.error('Error enviando email de verificación:', e);
      }

      res.status(201).json({
        success: true,
        message: 'Usuario registrado. Revisa tu correo para verificar la cuenta',
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      console.error('Error en register:', error);
      res.status(500).json({
        success: false,
        error: 'Error al registrar usuario: ' + error.message
      });
    }
  }

  // POST /api/auth/forgot-password
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, error: 'Email requerido' });

      const user = await User.findByEmail(email);
      if (!user) return res.json({ success: true, message: 'Si el email existe, se enviará un enlace de recuperación' });

      const token = jwt.sign({ id: user.id, purpose: 'reset' }, process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2024', { expiresIn: '1h' });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetLink = `${frontendUrl}/reset-password?token=${token}`;

      try {
        await emailService.sendPasswordReset(user.email, resetLink);
      } catch (e) {
        console.error('Error enviando email de recuperación:', e);
      }

      res.json({ success: true, message: 'Si el email existe, se enviará un enlace de recuperación' });
    } catch (error) {
      console.error('Error en forgotPassword:', error);
      res.status(500).json({ success: false, error: 'Error procesando solicitud' });
    }
  }

  // POST /api/auth/reset-password
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      if (!token || !password) return res.status(400).json({ success: false, error: 'Token y nueva contraseña requeridos' });

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2024');
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Token inválido o expirado' });
      }

      if (decoded.purpose !== 'reset') return res.status(400).json({ success: false, error: 'Token inválido' });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

      await user.setPassword(password);

      res.json({ success: true, message: 'Contraseña restablecida correctamente' });
    } catch (error) {
      console.error('Error en resetPassword:', error);
      res.status(500).json({ success: false, error: 'Error al restablecer contraseña' });
    }
  }

  // POST /api/auth/verify-email
  async verifyEmail(req, res) {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ success: false, error: 'Token requerido' });

      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2024');
      } catch (e) {
        return res.status(400).json({ success: false, error: 'Token inválido o expirado' });
      }

      if (decoded.purpose !== 'verify') return res.status(400).json({ success: false, error: 'Token inválido' });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ success: false, error: 'Usuario no encontrado' });

      await user.setActive(true);

      res.json({ success: true, message: 'Correo verificado. Ahora puedes iniciar sesión.' });
    } catch (error) {
      console.error('Error en verifyEmail:', error);
      res.status(500).json({ success: false, error: 'Error verificando correo' });
    }
  }

  // PUT /api/auth/profile
  async updateProfile(req, res) {
    try {
      const updateData = req.body;
      const user = req.user; // adjuntado por middleware
      if (!user) return res.status(401).json({ success: false, error: 'No autorizado' });

      const updated = await user.update(updateData);
      res.json({ success: true, data: { user: updated.toJSON() } });
    } catch (error) {
      console.error('Error en updateProfile:', error);
      res.status(500).json({ success: false, error: 'Error actualizando perfil' });
    }
  }

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const user = await User.findByEmail(value.email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      const isValidPassword = await user.validatePassword(value.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Credenciales inválidas'
        });
      }

      await user.updateLastLogin();

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2024',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        error: 'Error al iniciar sesión'
      });
    }
  }

  // GET /api/auth/verify
  async verify(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'No autorizado'
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_clave_secreta_super_segura_2024');
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Token inválido'
      });
    }
  }

  // POST /api/auth/logout
  async logout(req, res) {
    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });
  }
}

module.exports = new AuthController();