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
  getToursWithin,
} = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();
router.use('/:tourId/reviews', reviewRouter);

router.route('/tour-stats').get(getTourStats);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router
  .route('/')
  .get(getAllTours)
  .post(
    authController.protect,
    authController.strictTo('admin', 'lead-guide'),
    createTour
  );
router
  .route(
    authController.protect,
    authController.strictTo('admin', 'guide', 'lead-guide'),
    '/monthly-plan/:year'
  )
  .get(getMonthlyPlan);

  router.route('/tours-Within/:distance/center/:lnglat/unit/:unit').get(getToursWithin);

router
  .route('/:id')
  .get(getTour)
  .patch(
    authController.protect,
    authController.strictTo('admin', 'lead-guide'),
    updateTour
  )
  .delete(
    authController.protect,
    authController.strictTo('admin', 'lead-guide'),
    deleteTour
  );

module.exports = router;
