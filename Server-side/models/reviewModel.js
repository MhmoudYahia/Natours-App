const mongoose = require('mongoose');
const Tour = require('./tourModel');

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

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

// Schema.statics is a way to define static methods that can be called on the model.
reviewSchema.statics.calcRatingAvg = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: tourId,
        nRating: { $sum: 1 },
        ratingAvg: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].ratingAvg,
      ratingsQuantity: stats[0].nRating,
    });
  }
};
//this.constructor: In other words, it gives you access to the Mongoose model that the document (called on a doc) is based on.

reviewSchema.post('save', function () {
  this.constructor.calcRatingAvg(this.tour);
});

// // findByIdAndUpdate
// // findByIdAndDelete
// reviewSchema.pre(/^findOneAnd/, async function(next) {
//   this.r = await this.findOne();
//   // console.log(this.r);
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function() {
//   // await this.findOne(); does NOT work here, query has already executed
//   await this.r.constructor.calcAverageRatings(this.r.tour);
// });

//===another sol ===
//In post query middleware, we get "docs" parameter which is nothing but the executed document. Since we have the document, we can use constructor on that to get the model ie docs.constructor . Now since we have model, we know that we can directly call statics method on that. That is what I have done.

reviewSchema.post(/^findOneAnd/, async function (doc) {
  await doc.constructor.calcRatingAvg(doc.tour);
});

module.exports = mongoose.model('Review', reviewSchema);
