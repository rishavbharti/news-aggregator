import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { getPreferences, updatePreferences } from '../controllers/user.js';

const router = express.Router();

router.get('/user/preferences', authenticate, getPreferences);
router.put('/user/preferences', authenticate, updatePreferences);

export default router;
