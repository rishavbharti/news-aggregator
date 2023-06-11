import express from 'express';
import dotenv from 'dotenv';
import * as routes from './routes/index.js';
import { fetchNewsFromAPI } from './service/news.js';

// Create express app
const app = express();
dotenv.config();

app.use(express.json());

fetchNewsFromAPI();

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Welcome to the News Aggregator app. APIs available at /api');
});

routes.allPaths.map((p) => {
  app.use('/api', routes[p]);
});

export default app;
