const express = require('express');
const { 
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

// Bring in Bootcamp model
const Bootcamp = require('../models/Bootcamp');

// Bring in advancedResults Middleware
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');

// Initialize the router
const router = express.Router();

// Bring in protect middleware to protect routes
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router.route('/')
.get(advancedResults(Bootcamp, 'courses'), getBootcamps)
.post(protect, authorize('publisher', 'admin'), createBootcamp)

router.route('/:id')
.get(getBootcamp)
.put(protect, authorize('publisher', 'admin'), updateBootcamp)
.delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

module.exports = router;