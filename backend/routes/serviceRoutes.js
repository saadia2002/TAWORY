const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Route pour créer un service
router.post('/services', serviceController.createService);

// Route pour récupérer tous les services
router.get('/services', serviceController.getAllServices);
router.get('/service', serviceController.getAllServiceswithemailprovider);

router.get('/services2', serviceController.getAllServiceswithProvider);

// Route pour récupérer un service par ID
router.get('/services/:id', serviceController.getServiceById);

// Route pour mettre à jour un service
router.put('/services/:id', serviceController.updateService);
router.put('/activer/:id', serviceController.activerService);

// Route pour supprimer un service
router.delete('/services/:id', serviceController.deleteService);

module.exports = router;
