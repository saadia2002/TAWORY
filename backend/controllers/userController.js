// controllers/userController.js
const User = require('../models/User');

// Créer un utilisateur
exports.createUser = async (req, res) => {
  try {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      dateOfBirth: req.body.dateOfBirth,
    };

    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      userData.image = base64Image;
    }

    console.log('Received data:', { ...userData, password: '***hidden***' });

    const user = new User(userData);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message),
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      dateOfBirth: req.body.dateOfBirth,
    };

    if (req.body.password) {
      userData.password = req.body.password;
    }

    if (req.file) {
      const base64Image = req.file.buffer.toString('base64');
      userData.image = base64Image;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      userData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        details: Object.values(error.errors).map(err => err.message),
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};
