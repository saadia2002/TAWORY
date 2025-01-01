// reservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const {  handleChatbotMessage } = require('../controllers/chatbootController');

// Routes
router.post('/', reservationController.createReservation);
router.get('/', reservationController.getAllReservations);
router.get('/:id', reservationController.getReservationById);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', reservationController.deleteReservation);
// Using reservation routes
// Route pour analyser le texte avec l'API Gemini
router.post('/chatbot', handleChatbotMessage);

module.exports = router;