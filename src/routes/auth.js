import express from 'express';
import { register, login } from '../controllers/auth.js';
import {
  validateRegisterRequest,
  validateLoginRequest,
} from '../middlewares/auth.js';

const router = express.Router();

router.post('/auth/register', validateRegisterRequest, register);
router.post('/auth/login', validateLoginRequest, login);

export default router;
