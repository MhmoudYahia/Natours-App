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
  isLoggedIn
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
} = require('../controllers/userController');

router.route('/signup').post(signup);
router.route('/login').post(login);
router.route('/forgetPassword').post(forgetPassword);
router.route('/resetPassword/:token').patch(resetPassword);
router.route('/isLoggedIn').get(isLoggedIn);

// Protect all routes after this middleware
router.use(protect);

router.route('/updatePassword').patch(updatePassword);
router.route('/me').get(getMe, getUser);
router.route('/updateMyData').patch(updateMyData);
router.route('/deleteMe').delete(deleteMe);

router.use(strictTo('admin'));

router.route('/').get(getAllUsers).post(creatUser);
router.route('/:id').delete(deleteUser).patch(updateUser).get(getUser);
module.exports = router;
