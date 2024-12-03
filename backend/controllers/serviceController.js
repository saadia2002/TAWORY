const Service = require('../models/Service');

// Créer un service
exports.createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Récupérer tous les services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllServiceswithProvider = async (req, res) => {
  try {
    // Populate the serviceProvider field with user data where the role is 'prestataire'
    const services = await Service.find()
      .populate({
        path: 'serviceProvider',
        match: { role: 'prestataire' }, // Filtre pour ne ramener que les prestataires
        select: 'name image' // Inclut uniquement les champs nécessaires
      });

    res.status(200).json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un service par ID
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    // const service = await Service.findById(req.params.id).populate('category serviceProvider reservations');
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mettre à jour un service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service non trouvé' });
    }
    res.status(200).json({ message: 'Service supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
