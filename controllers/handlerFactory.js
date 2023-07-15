const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new appError('Document with this ID not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Document have been Deleted',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true, //if true, return the modified document rather than the original
    });

    if (!doc) {
      return next(new appError('Tour with this ID not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { doc },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions.path);

    const doc = await query;

    if (!doc) {
      return next(new appError('doc with this ID not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { doc },
      user: res.locals.user,
      booked: res.locals.booked,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    if (req.params.userId) filter = { user: req.params.userId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const tours = await Tour.find();
    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { docs },
    });
  });
