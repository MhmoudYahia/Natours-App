const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must have a user'],
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must be on a Tour'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price'],
  },
  paid: {
    type: Boolean,
    default: false,
  },
});

BookingSchema.index({ tour: 1, user: 1 }, { unique: true });

BookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate('tour');
  next();
});

const Booking = mongoose.model('Booking', BookingSchema);

module.exports = Booking;
