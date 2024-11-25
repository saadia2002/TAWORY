const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'prestataire', 'user'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  image: {
    type: String, // Pour stocker l'image en base64
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);