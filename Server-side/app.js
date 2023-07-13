const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const globalErrorHandler = require('./controllers/errorController');
const appError = require('./utils/appError');

const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//headers
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

//sessions  ======================== this part for ref only (0no need)==========================================
const DBString = process.env.DATABASE.replace(
  '<password>',
  process.env.PASSWORD
);

const store = new MongoDBStore({
  uri: DBString,
  collection: 'sessions',
});

store.on('error', function (error) {
  console.log(error);
});

app.use(
  session({
    secret: 'my_secret_key',
    resave: false,
    saveUninitialized: true,
    // store: store,
  })
);
// ===================================================================================

// Body parser, reading data from body into req.body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize()); //mongoSanitize is a middleware function for Node.js web applications that helps prevent MongoDB operator injection attacks by removing any keys that start with $ or contain a . in the request body, request query parameters, and request params.

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Limit requests from same API
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: {
    message: 'Too many requests, try again in an hour',
    status: 'warning',
  },
});
app.use('/api', limiter);

const cors = require('cors');
app.use(cors({ origin: true, credentials: true }));

// Serving static files
app.use(express.static('../front-part'));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // res.locals.jwt = req.cookies.jwt;
  // console.log(res.locals.jwt);
  // req.session.isAuth = true;
  // console.log(req.cookies);
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

// if the above route doesn't fit, this will work
app.all('*', (req, res, next) => {
  next(new appError(`Cant find ${req.originalUrl} on this server!`, 404));
});
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   res.json({user: req.session.user});
//   // console.log(res.locals);
//   // req.session.isAuth = true;
//   console.log(req.session);
//   next();
// });
app.use(globalErrorHandler);

module.exports = app;
