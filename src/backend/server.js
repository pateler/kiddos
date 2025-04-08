
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db.js';
import { createSampleVideos } from './data/sampleVideos.js';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to database
connectDB();
const initializeServer = async () => {
  const conn = await connectDB();
  
  // Create sample data after DB connection
  if (conn) {
    await createSampleVideos();
  }
};

// Call the initialization function
initializeServer();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static files - make uploads accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
import authRoutes from './routes/authRoutes.js';
app.use('/api/auth', authRoutes);
import videoRoutes from './routes/videoRoutes.js';
app.use('/api/videos', videoRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'VideoVoyage API is running...' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
