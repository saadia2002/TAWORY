const mongoose = require("mongoose");
const Service = require("./Service");

// Schéma pour les catégories de service
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    icon: {
      type: String, // Stocker l'icône sous forme de base64 (chaîne de caractères)
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
