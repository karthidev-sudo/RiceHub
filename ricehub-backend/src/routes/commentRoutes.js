import express from 'express';
import { addComment, getCommentsByRice, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/v1/comments/:riceId -> Public
router.get('/:riceId', getCommentsByRice);

// POST /api/v1/comments -> Private
router.post('/', protect, addComment);

router.delete('/:id', protect, deleteComment);

export default router;