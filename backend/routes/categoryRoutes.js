const express = require('express');
// const Category = require('../models/Category');
const Service = require('../models/Service');
const Category = require('../models/Category');
// Chemin correct vers le fichier du modèle Service

const router = express.Router();

// Créer une nouvelle catégorie
router.post('/', async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = new Category({
      name,
      description
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lire toutes les catégories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().populate('services');
    console.log(categories);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Lire une catégorie par son ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('services');

    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mettre à jour une catégorie
router.put('/:id', async (req, res) => {
  const { name, description } = req.body;

  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Supprimer une catégorie
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Catégorie non trouvée' });
    }
    res.json({ message: 'Catégorie supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur du serveur', error });
  }
});

module.exports = router;
