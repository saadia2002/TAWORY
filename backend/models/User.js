const mongoose = require('mongoose');

// Définition du schéma utilisateur
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'prestataire'], // Restreindre aux valeurs possibles
    required: true,
  },
  dateOfBirth: {
    type: Date, // Utilisez le type Date pour la date de naissance
    required: true, // Si vous souhaitez que ce champ soit obligatoire
  },
  image: {
    type: String, // Utilisez un type String pour stocker l'URL de l'image
    required: false, // Cela peut être facultatif, selon vos besoins
  },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User;