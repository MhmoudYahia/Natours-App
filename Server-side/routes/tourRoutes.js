const express = require('express');
const {
  getAllTours,
  createTour,
  aliasTopTours,
  updateTour,
  deleteTour,
  getTour,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);

router.route('/').get(authController.protect, getAllTours).post(createTour);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.strictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
