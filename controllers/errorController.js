const AppError = require('../utils/appError');

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: err,
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);

  // 2) Send generic message
  return res.status(err.statusCode).json({
    status: 'error',
    message: 'Please try again later.',
  });
};
const sendErrorDev = (err, req, res) => {
  // A) API
  // if (req.originalUrl.startsWith('/api'))
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });

  // // B) RENDERED WEBSITE
  // return res.status(err.statusCode).json({
  //   msg: err.message,
  //   status: 'error',
  // });
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((er) => er.message);
  const message = errors.join('. ');
  return new AppError(`Errors are: ${message}`, 400);
};

const handleDuplicateFieldsErrorDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];

  const message = `Duolicate field value: ${value}. use another value!`;
  return new AppError(message, 400);
};

const handleCastedErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handelWebTokenError = () => {
  return new AppError('In Valid Token. Please log in again', 401);
};

const handleTokenExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV.trim() == 'production') {
    let error = Object.assign(err); // let error = { ...err }; this was a great bug
    // error.message = err.message;
    if (error.name === 'CastError') {
      error = handleCastedErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsErrorDB(error);
    }
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handelWebTokenError();
    }
    if (error.name === 'TokenExpiredError') {
      error = handleTokenExpiredError(error);
    }
    sendErrorProd(error, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
};
