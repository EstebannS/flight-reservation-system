const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authenticate } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authenticate);

router.post('/', reservationController.create);
router.get('/my-reservations', reservationController.getMyReservations);
router.get('/:id', reservationController.getById);
router.post('/:id/cancel', reservationController.cancel);
router.post('/:id/confirm-payment', reservationController.confirmPayment);

module.exports = router;