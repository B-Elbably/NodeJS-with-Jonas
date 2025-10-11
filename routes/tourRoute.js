const express = require('express');
const router = express.Router();
const tourController = require('../controllers/tourController');
const {
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
    checkID,
    checkBody,
} = tourController;

// TASK: param middleware
router.param('id', checkID);

// TASK: Routes
router.route('/').get(getAllTours).post(checkBody, createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
