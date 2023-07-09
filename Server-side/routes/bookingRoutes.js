const express = require('express');
const bookingController = require('../controllers/bookingsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); //When mergeParams is set to true, route parameters defined in the parent router will be merged with those defined in the child router.

router.use(authController.protect);

router.route('/addbooking').post(bookingController.addBooking);
router.route('/:userId').get(bookingController.getAllBookingsToUser);

router
  .route('/')
  .get(
    authController.strictTo('admin', 'lead-guide'),
    bookingController.getAllBookingsToUser
  );
module.exports = router;
