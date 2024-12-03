// const express = require('express');
// const User = require('../models/User');
// const multer = require('multer');
// const path = require('path');

// // Configuration de multer pour stocker les fichiers dans public/img
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img'); // Dossier de destination pour les images
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp
//   },
// });

// const upload = multer({ storage }); // Créer une instance de multer avec la configuration de stockage

// const router = express.Router();

// // Récupérer tous les utilisateurs
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Récupérer un utilisateur par son ID
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// ///creation
// router.post('/', async (req, res) => {
//   const { name, email, password, role, dateOfBirth, image } = req.body;

//   // Vérifiez que les champs requis sont fournis
//   if (!name || !email || !password || !role || !dateOfBirth || !image) {
//     return res.status(400).json({ message: 'Tous les champs sont requis.' });
//   }

//   const newUser = new User({
//     name,
//     email,
//     password, // Enregistrer le mot de passe tel quel
//     role,
//     dateOfBirth,
//     image, // Enregistrer le nom de l'image
//   });

//   try {
//     const savedUser = await newUser.save();
//     res.status(201).json(savedUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
// // Mettre à jour un utilisateur par son ID
// router.put('/:id', async (req, res) => {
//   try {
//     // Récupérez les données du corps
//     const { name, email, role, dateOfBirth, image, password } = req.body;

//     console.log('Données reçues:', req.body);



//     // Construisez un objet pour mettre à jour
//     const updateData = {
//       name,
//       password,
//       email,
//       role,
//       dateOfBirth,
//       image, // Le nom du fichier d'image est directement utilisé ici
//     };

//     // Mise à jour de l'utilisateur
//     const updatedUser = await User.findByIdAndUpdate(
//         req.params.id,
//         updateData,
//         { new: true, runValidators: true }
//     );

//     // Vérifiez si l'utilisateur a été trouvé et mis à jour
//     if (!updatedUser) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     res.status(200).json(updatedUser);
//   } catch (err) {
//     console.error("Erreur lors de la mise à jour de l'utilisateur:", err); // Log de l'erreur
//     res.status(500).json({ message: 'Erreur interne du serveur', error: err.message });
//   }
// });

// // Supprimer un utilisateur par son ID
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Vérifie si l'ID est fourni
//     if (!id) {
//       return res.status(400).json({ message: 'ID est requis' });
//     }

//     const deletedUser = await User.findByIdAndDelete(id);

//     // Vérifie si l'utilisateur a été trouvé et supprimé
//     if (!deletedUser) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
//   } catch (err) {
//     console.error(err); // Journaliser l'erreur pour le débogage
//     res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error: err.message });
//   }
// });

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/userController');

// Configuration de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes utilisateur
router.post('/', upload.single('image'), userController.createUser);
router.get('/', userController.getAllUsers);
router.put('/:id', upload.single('image'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
