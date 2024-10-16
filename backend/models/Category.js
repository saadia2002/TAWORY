const mongoose = require('mongoose');

// Schéma pour les catégories de service
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String
  },
  // Liste de services appartenant à cette catégorie
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service' // Référence au modèle 'Service'
  }]
}, {
  timestamps: true
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
