import express from 'express';
import multer from 'multer';
import { uploadAndExtractDocument } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

router.post('/document', protect, upload.single('file'), uploadAndExtractDocument);



export default router;
