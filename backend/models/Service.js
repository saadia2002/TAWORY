const mongoose = require('mongoose');

// Schéma pour les services
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reservations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive'] ,// Liste des valeurs valides
    default: 'inactive'

  }
}, {
  timestamps: true // Ajoute createdAt et updatedAt
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
