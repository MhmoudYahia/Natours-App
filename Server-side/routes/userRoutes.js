const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
  strictTo,
  isLoggedIn,
  logout,
} = require('../controllers/authController');
const {
  getAllUsers,
  updateMyData,
  deleteMe,
  deleteUser,
  updateUser,
  getUser,
  getMe,
  creatUser,
  uploadPhoto,
  resizePhoto,
} = require('../controllers/userController');

//make review router on user (CRUD on its reviews)
const reviewRouter = require('./reviewRoutes');
router.use('/:userId/reviews', reviewRouter);

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgetPassword').post(forgetPassword);
router.route('/resetPassword/:token').patch(resetPassword);
router.route('/isLoggedIn').get(isLoggedIn);

// Protect all routes after this middleware
router.use(protect);

router.route('/updatePassword').patch(updatePassword);
router.route('/me').get(getMe, getUser);
router.route('/updateMyData').patch(uploadPhoto, resizePhoto, updateMyData);
router.route('/deleteMe').delete(deleteMe);

router.use(strictTo('admin'));

router.route('/').get(getAllUsers).post(creatUser);
router.route('/:id').delete(deleteUser).patch(updateUser).get(getUser);
module.exports = router;
