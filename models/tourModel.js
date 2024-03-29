const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must hsve a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy or medium or difficult',
      },
      default: 'easy',
    },
    ratingsAverage: {
      type: Number,
      default: 2.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating musty be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [
      {
        date: {
          type: Date,
          required: [true, 'A tour date must have a date'],
        },
        participants: {
          type: Number,
          default: 0,
        },
        soldOut: {
          type: Boolean,
          default: false,
        },
      },
    ],
    secretTour: {
      type: Boolean,
      default: false,
      select: false,
    },
    startLocation: {
      // GeoJSON  The type and coordinates properties of the startLocation field are required for GeoJSON data to be valid,
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    // strictQuery: true,
    virtuals: true,
  }
);
// tourSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

tourSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'tour',
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, (next) => {
  // this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.post(/^find/, (req, res, next) => {
  console.log(`Query took ${Date.now() - this.start} ms`);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -role',
  });
  next();
});

tourSchema.pre('save', function (next) {
  this.startDates.forEach((startDate) => {
    if (startDate.participants >= this.maxGroupSize) {
      startDate.soldOut = true;
    }
  });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

//AGGREGATION MIDDLEWARE
//You get an error because the arrow function changes the scope of 'this.' Just use
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log('aggregation pipeline is', this.pipeline());

//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
