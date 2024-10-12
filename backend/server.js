const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/auth');
const cors = require('cors');
// Use the user routes


// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors()); // Permet toutes les origines
app.use(express.json()); // Pour parser les requêtes JSON

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

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
