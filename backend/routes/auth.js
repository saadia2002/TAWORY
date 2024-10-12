const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Pour hasher le mot de passe
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Route POST pour la connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Créer et signer le token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, msg: 'Login successful' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});
// Route POST pour l'inscription
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Créer un nouvel utilisateur
    user = new User({
      name,
      email,
      password
    });

    // Hash du mot de passe avant de le sauvegarder
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Sauvegarder l'utilisateur
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
