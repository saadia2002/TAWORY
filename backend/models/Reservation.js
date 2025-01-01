const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'cancelled'],
      default: 'pending',
    },
    lieu: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
