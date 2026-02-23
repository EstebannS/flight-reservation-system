const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/verify', authController.verify);

// Password reset
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Profile update (protegido)
router.put('/profile', authenticate, authController.updateProfile);

// Verify email
router.post('/verify-email', authController.verifyEmail);

module.exports = router;
