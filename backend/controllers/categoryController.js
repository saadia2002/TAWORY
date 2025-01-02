// controllers/categoryController.js
const Category = require("../models/Category");

const categoryController = {
  // Créer une nouvelle catégorie
  createCategory: async (req, res) => {
    const { name, description } = req.body;
    const image = req.file ? req.file.buffer.toString("base64") : null;

    try {
      const category = new Category({
        name,
        description,
        icon: image,
      });

      await category.save();
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtenir toutes les catégories
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find().populate("services");
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtenir une catégorie par ID
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id).populate(
        "services",
      );

      if (!category) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }

      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Supprimer une catégorie
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndDelete(req.params.id);

      if (!category) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }

      res.status(200).json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);

      if (!category) {
        return res.status(404).json({ message: "Catégorie non trouvée" });
      }

      // Mise à jour des champs texte
      if (req.body.name) category.name = req.body.name;
      if (req.body.description) category.description = req.body.description;

      // Mise à jour de l'image si elle est fournie
      if (req.file) {
        category.icon = req.file.buffer.toString("base64");
      }

      await category.save();
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};

module.exports = categoryController;
