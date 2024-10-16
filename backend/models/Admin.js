const mongoose = require('mongoose');

// Schéma pour les administrateurs
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'superadmin'],
    default: 'admin'
  },
  canManageUsers: {
    type: Boolean,
    default: true
  },
  canManageCategories: {
    type: Boolean,
    default: true
  },
  canManageReservations: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
