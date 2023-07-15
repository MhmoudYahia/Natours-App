const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('uncaught exception'.toUpperCase(), ',Shutting down......');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 2000;

const app = require('./app');

const DBString = process.env.DATABASE.replace(
  '<password>',
  process.env.PASSWORD
);

let server;
mongoose.connect(DBString).then(() => {
  console.log('DB connection established');
  server = app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
  });
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection'.toUpperCase(), ',Shutting down....');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
