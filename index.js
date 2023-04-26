import express from 'express';
import dotenv from 'dotenv';
import * as routes from './src/routes/index.js';

// Create express app
const app = express();
dotenv.config();

app.use(express.json());

app.get('/', (req, res) => {
  res
    .status(200)
    .send('Welcome to the News Aggregator app. APIs available at /api');
});

routes.allPaths.map((p) => {
  app.use('/api', routes[p]);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      'Server is successfully running and app is listening on port ' + PORT
    );
  } else console.log("Error occurred, server can't start", error);
});
