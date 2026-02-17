require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const aiRoutes = require('./routes/ai.routes');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  const statusCode = err.status || err.statusCode || 500;
  const errorMessage = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: errorMessage,
      status: statusCode
    }
  });
});

const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET;

if (!mongoUri) {
  console.error('MONGODB_URI is not set. Please configure it in your .env file.');
  process.exit(1);
}

if (!jwtSecret) {
  console.error('JWT_SECRET is not set. Please configure it in your .env file.');
  process.exit(1);
}

mongoose.set('strictQuery', true);

mongoose
  .connect(mongoUri)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });

module.exports = app;
