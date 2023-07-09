const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.addBooking = catchAsync(async (req, res, next) => {
  const { tour, user, price, selectedDate, paid } = req.body;
  const doc = await Booking.create({ tour, user, price, paid });

  //increment participations number
  const bookedTour = await Tour.findById(tour);

  bookedTour.startDates.forEach((startDate) => {
    console.log(startDate);
    console.log(selectedDate);

    if (startDate.date.toISOString() === selectedDate.date) {
      startDate.participants++;
    }
  });

  await bookedTour.save();

  // console.log(selectedDate);
  // console.log(bookedTour);

  res.status(201).json({
    status: 'success',
    data: { doc },
  });
});

exports.isTourBookedByCurrUser = async (req, res, next) => {
  if (!res.locals.user) {
    return next();
  }
  const booking = await Booking.findOne({
    tour: req.params.id,
    user: res.locals.user,
  });
  if (booking) {
    res.locals.booked = true;
  } else {
    res.locals.booked = false;
  }
  next();
};
exports.getAllBookingsToUser = factory.getAll(Booking);
