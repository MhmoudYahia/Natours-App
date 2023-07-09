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
      console.log(55555555555555555555555555555555555555555555555555555555555);
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
exports.getAllBookingsToUser = factory.getAll(Booking);
