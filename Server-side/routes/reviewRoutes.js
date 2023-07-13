const express = require('express');
const revController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true }); //When mergeParams is set to true, route parameters defined in the parent router will be merged with those defined in the child router.

router.use(authController.protect);

router.get('/', revController.getAllReviews);

router.post(
  '/addreview',
  authController.protect,
  authController.strictTo('user'),
  revController.setUserTourIds,
  revController.addNewReview
);

router
  .route('/:id')
  .get(revController.getReview)
  .delete(authController.strictTo('user', 'admin'), revController.deleteReview)
  .patch(authController.strictTo('user', 'admin'), revController.updateReview);

  
module.exports = router;
