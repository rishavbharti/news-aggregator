import app from './app.js';

const PORT = process.env.PORT || 8000;

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      'Server is successfully running and app is listening on port ' + PORT
    );
  } else console.log("Error occurred, server can't start", error);
});
