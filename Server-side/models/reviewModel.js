const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review Body is reqired'],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'must belong to  a tour'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'must belong to  a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // strictQuery: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'user',
  //     select:'-_id -__v name photo'
  //   }).populate({
  //     path:'tour',
  //     select:'summary name  -_id'
  //   });
  this.populate({
    path: 'user',
    select: ' name photo',
  });

  next();
});

module.exports = mongoose.model('Review', reviewSchema);
