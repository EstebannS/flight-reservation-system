const express = require('express');
const router = express.Router();

// Controlador temporal
const flightController = {
    search: (req, res) => {
        res.json({
            message: 'Search endpoint - En construcción',
            query: req.query
        });
    },
    getFares: (req, res) => {
        res.json({ message: 'Fares endpoint - En construcción' });
    },
    getById: (req, res) => {
        res.json({ message: `Flight ${req.params.id} - En construcción` });
    },
    getStatus: (req, res) => {
        res.json({ message: `Status for ${req.params.flightNumber} - En construcción` });
    }
};

router.get('/search', flightController.search);
router.get('/fares', flightController.getFares);
router.get('/status/:flightNumber', flightController.getStatus);
router.get('/:id', flightController.getById);

module.exports = router;