const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

const filterObj = (obj, ...fields) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (fields.includes(key)) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'F:/MyRepos/Natours-App/front-part/natours-app/public/img/users');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + req.user.id;
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${uniqueSuffix}.${ext}`);
//   },
// });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload an image!', 400));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
// In Node.js, req.file.buffer refers to the binary data of an uploaded file that is stored in memory as a buffer.
// When you upload a file using an HTML form with the enctype attribute set to multipart/form-data, the file is sent to the server in parts as a stream of binary data. The multer middleware for Node.js can be used to handle multipart/form-data requests and extract the file data from the request body.
// When multer processes an uploaded file, it creates an object that contains information about the file, such as its original filename, content type, and size. One of the properties of this object is the buffer property, which contains the binary data of the file.

exports.resizePhoto = async(req, res, next) => {
  if (!req.file) return next();
  const uniqueSuffix = Date.now() + '-' + req.user.id;

  req.file.filename = `user-${uniqueSuffix}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(
      `F:/MyRepos/Natours-App/front-part/natours-app/public/img/users/${req.file.filename}`
    );

  next();
};

exports.uploadPhoto = upload.single('photo');

exports.updateMyData = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for password updates', 400));
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

  if (!filteredBody) {
    return next(new AppError('No update', 400));
  }
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true, //return modified user
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { updatedUser },
  });
});

//Noe I Authorized
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { $set: { active: false } });

  res.status(200).json({
    status: 'success',
    data: null,
  });
});

// sessoin auth method
exports.getCurrentAuthUser = catchAsync(async (req, res) => {
  const currU = req.session.user;
  const isAuth = req.session.isAuth;

  res.status(200).json({
    status: 'success',
    user: { currU },
    isAuth,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.getUser = factory.getOne(User);
exports.creatUser = factory.createOne(User);
