const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
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

// Body parser, reading data from body into req.body
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.use(cookieParser());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: { mess: 'Too many requests, try again in an hour' },
});
app.use('/api', limiter);

const cors = require('cors');
app.use(cors());

// Serving static files
app.use(express.static('../front-part'));

app.use((req, res, next) => {
  console.log(req.body);
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// if the above route doesn't fit, this will work
app.all('*', (req, res, next) => {
  next(new appError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
