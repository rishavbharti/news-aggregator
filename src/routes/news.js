import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { getNews } from '../controllers/news.js';

const router = express.Router();

router.get('/news', authenticate, getNews);

export default router;
