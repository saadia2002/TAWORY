// reservationController.js
const Reservation = require('../models/Reservation');

// Create a new reservation
exports.createReservation = async (req, res) => {
  try {
    const { service, client, date, lieu, telephone, status } = req.body;
    
    const reservation = new Reservation({
      service,
      client,
      date,
      lieu,
      telephone,
      status: status || 'pending'
    });
    
    await reservation.save();
    const populatedReservation = await reservation.populate('service client');
    res.status(201).json(populatedReservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('service client')
      .sort({ date: -1 }); // Trie par date décroissante
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('service client');
    
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a reservation
exports.updateReservation = async (req, res) => {
  try {
    const { service, client, date, lieu, telephone, status } = req.body;
    
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      {
        service,
        client,
        date,
        lieu,
        telephone,
        status
      },
      { new: true, runValidators: true }
    ).populate('service client');

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a reservation
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: 'Réservation non trouvée' });
    }
    res.status(200).json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};