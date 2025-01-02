const mongoose = require("mongoose");

// Schéma pour les prestataires de service
const serviceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contactInfo: {
      phone: { type: String },
      address: { type: String },
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema,
);
module.exports = ServiceProvider;
