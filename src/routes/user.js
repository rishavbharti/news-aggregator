import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { updatePreferences } from '../controllers/user.js';

const router = express.Router();

router.put('/user/preferences', authenticate, updatePreferences);

export default router;
