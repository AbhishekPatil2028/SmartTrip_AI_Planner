import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';

// Load environmental variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Vercel production URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Also allow any *.vercel.app subdomain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Gemini-Key'],
  credentials: true,
}));

app.use(express.json());

// Resolve paths for modern ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/itineraries', itineraryRoutes);

// Server status route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    message: 'SmartTrip AI Planner API is running smoothly',
    timestamp: new Date(),
  });
});

// Root Route fallback
app.get('/', (req, res) => {
  res.send('SmartTrip AI Backend API is active. Access endpoints via /api/...');
});

// Global 404 error handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Global server error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Internal Error Stack:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
