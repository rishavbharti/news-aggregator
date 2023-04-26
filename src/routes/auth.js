import express from 'express';
import { register } from '../controllers/auth.js';
import { validateRegisterRequest } from '../middlewares/auth.js';

const router = express.Router();

router.post('/auth/register', validateRegisterRequest, register);

export default router;
