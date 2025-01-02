const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // Pour hasher le mot de passe
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Route POST pour la connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Comparer le mot de passe en texte brut
    if (password !== user.password) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Si tout est correct, retournez une réponse de succès
    res.status(200).json({ msg: "Login successful", user: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});


// Route POST pour l'inscription
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Créer un nouvel utilisateur
    user = new User({
      name,
      email,
      password,
    });

    // Hash du mot de passe avant de le sauvegarder
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
 console.log("il entrre");
    // Sauvegarder l'utilisateur
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
