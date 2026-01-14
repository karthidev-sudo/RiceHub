import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'; // Ensure this exists from Step 4
import { createRice, toggleLike, getAllRices, getRiceById, deleteRice } from '../controllers/riceController.js'; // Import it here


const router = express.Router();

// GET /api/v1/rices - Public
router.get('/', getAllRices);
router.get('/:id', getRiceById);

// POST /api/v1/rices - Private (Needs Token + Image)
router.post('/', protect, upload.single('image'), createRice);

router.put('/:id/like', protect, toggleLike);

router.delete('/:id', protect, deleteRice);

export default router;