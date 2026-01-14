import express from 'express';
import { getUserProfile, updateUserProfile, toggleSaveRice, getMySavedRices } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();


router.put('/profile', protect, upload.single('avatar'), updateUserProfile);

router.put('/save', protect, toggleSaveRice);

router.get('/saved', protect, getMySavedRices);

router.get('/:username', getUserProfile);

export default router;