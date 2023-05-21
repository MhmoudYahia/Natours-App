const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
} = require('../controllers/authController');
const {
  getAllUsers,
  updateMyData,
  deleteMe,
} = require('../controllers/userController');

router.route('/signup').post(signup);
router.route('/login').post(login);

router.route('/forgetPassword').post(forgetPassword);
router.route('/resetPassword/:token').patch(resetPassword);
router.route('/updatePassword').patch(protect, updatePassword);

router.route('/').get(getAllUsers);
router.route('/updateMyData').patch(protect, updateMyData);
router.route('/deleteMe').delete(protect,deleteMe);
module.exports = router;

