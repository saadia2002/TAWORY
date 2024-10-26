// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const Category = require('../models/Category');

// // Configuration de multer pour gérer le téléchargement de fichiers
// const storage = multer.memoryStorage(); // Stockage en mémoire, tu peux aussi configurer un chemin local
// // const upload = multer({
// //   limits: {
// //     fileSize: 10 * 1024 * 1024, // 10 MB
// //     fieldSize: 10 * 1024 * 1024 // 10 MB
// //   }
// // });

// // Créer une nouvelle catégorie avec upload d'image
// router.post('/', upload.single('image'), async (req, res) => {
//   const { name, description } = req.body;
//   const image = req.file ? req.file.buffer.toString('base64') : null; // Convertir le fichier en base64
//   console.log("hani hnaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
//   console.log(image)
//   // console.log(req)
//   try {
//     const category = new Category({
//       name,
//       description,
//       icon: image // Stocker l'image sous forme de base64 dans la base de données
//     });

//     await category.save();
//     res.status(201).json(category);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// // // Créer une nouvelle catégorie
// // router.post('/', async (req, res) => {
// //   const { name, description, icon } = req.body; // Récupérer l'icône

// //   try {
// //     const category = new Category({
// //       name,
// //       description,
// //       icon // Stocker l'icône dans la base de données
// //     });

// //     await category.save();
// //     res.status(201).json(category);
// //   } catch (error) {
// //     res.status(400).json({ message: error.message });
// //   }
// // });

// // Lire toutes les catégories
// router.get('/', async (req, res) => {
//   try {
//     const categories = await Category.find().populate('services');
//     // console.log(categories);
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Lire une catégorie par son ID
// router.get('/:id', async (req, res) => {
//   try {
//     const category = await Category.findById(req.params.id).populate('services');

//     if (!category) {
//       return res.status(404).json({ message: 'Catégorie non trouvée' });
//     }

//     res.status(200).json(category);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   console.log("waaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
//   console.log('Received ID:', req.params.id);  // Log the received ID
//   try {
//     const category = await Category.findByIdAndDelete(req.params.id);
//     if (!category) {
//       return res.status(404).json({ message: 'Catégorie non trouvée' });
//     }
//     res.status(200).json({ message: 'Catégorie supprimée avec succès' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
// // Mettre à jour une catégorie
// router.put('/:id', async (req, res) => {
//   const { name, description, icon } = req.body;

//   try {
//     const category = await Category.findById(req.params.id);

//     if (!category) {
//       return res.status(404).json({ message: 'Catégorie non trouvée' });
//     }

//     category.name = name || category.name;
//     category.description = description || category.description;
//     category.icon = icon || category.icon; // Mettre à jour l'icône si présente

//     await category.save();
//     res.status(200).json(category);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// module.exports = router;
// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const categoryController = require('../controllers/categoryController');

// Configuration de multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
    fieldSize: 10 * 1024 * 1024 // 10 MB
  }
});

// Routes
router.post('/', upload.single('image'), categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.delete('/:id', categoryController.deleteCategory);
router.put('/:id', categoryController.updateCategory);

module.exports = router;