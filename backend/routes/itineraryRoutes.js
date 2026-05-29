import express from 'express';
import {
  generateItinerary,
  getItineraries,
  getItineraryById,
  deleteItinerary,
  toggleShareItinerary,
  getSharedItinerary,
  importSharedItinerary,
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/shared/:shareId', getSharedItinerary);

// Private routes (JWT authentication required)
router.post('/generate', protect, generateItinerary);
router.get('/', protect, getItineraries);
router.get('/:id', protect, getItineraryById);
router.delete('/:id', protect, deleteItinerary);
router.patch('/:id/share', protect, toggleShareItinerary);
router.post('/shared/:shareId/import', protect, importSharedItinerary);

export default router;
