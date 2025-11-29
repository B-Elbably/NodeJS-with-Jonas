const express = require('express');
const tourController = require('../controllers/tourController');
<<<<<<< HEAD
const authController = require('../controllers/authController');
=======
>>>>>>> 3cbeeb6 (until authorization start)

const router = express.Router();
const {
    getMonthlyPlan,
    getTourStats,
    aliasTopTours,
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    //!!! checkID, // Mongoose handles ID validation
    //y!!! checkBody, // Not needed as Mongoose schema validation is used
} = tourController;

// TASK: param middleware
// router.param('id', checkID);

// TASK: Routes
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

<<<<<<< HEAD
router.route('/').get(authController.protect, getAllTours).post(createTour);
=======
router.route('/').get(getAllTours).post(createTour);
>>>>>>> 3cbeeb6 (until authorization start)

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
