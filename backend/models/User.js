const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "prestataire", "user"],
            required: true,
            default: "user", // Valeur par défaut si non fournie
        },
        dateOfBirth: {
            type: Date,
            required: true,
            default: "",
        },
        image: {
            type: String, // Pour stocker l'image en base64
            required: false,
            default: "", // Valeur par défaut vide si non fournie
        },
    },
    {
        timestamps: true, // Permet d'ajouter automatiquement des champs createdAt et updatedAt
    },
);

module.exports = mongoose.model("User", userSchema);
