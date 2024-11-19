const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/serviceRoutes');
const cors = require('cors');
const categoryRoutes = require('./routes/categoryRoutes'); // Importer les routes des catégories

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Permet toutes les origines

app.use(express.urlencoded({ extended: true })); // Pour traiter les données d'URL encodées (comme pour les formulaires)

// Middleware to parse JSON data
app.use(express.json());
console.log(require('crypto').randomBytes(32).toString('hex'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

  app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
  });
  
// Utilisation des routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/categories', categoryRoutes);
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
app.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on http://0.0.0.0:5000');
});
