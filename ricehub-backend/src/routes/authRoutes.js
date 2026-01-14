import express from 'express';
import { register, login, logout, checkAuth } from '../controllers/authController.js'; // Import checkAuth
import { protect } from '../middleware/authMiddleware.js'; // Import protect

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// NEW ROUTE:
router.get('/check', protect, checkAuth);

export default router;