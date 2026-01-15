import express from 'express';
import { getExternalRices } from '../controllers/externalController.js';

const router = express.Router();

router.get('/', getExternalRices);

export default router;