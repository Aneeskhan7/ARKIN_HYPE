/* eslint-disable prettier/prettier */
// /* eslint-disable prettier/prettier */
// const express = require('express');
// const reviewController = require('./../controllers/reviewController');
// const authController = require('./../controllers/authController');

// const router = express.Router();

// router.use(authController.protect);

// router
//     .route('/')
//     .get(reviewController.getAllReviews)
//     .post(
//         authController.restrictTo('Customer'),
//         reviewController.createReview
//     );

// router
//     .route('/:id')
//     .get(reviewController.getReview)
//     .patch(
//         authController.restrictTo('Customer'),
//         reviewController.updateReview
//     )
//     .delete(
//         authController.restrictTo('admin', 'Customer'),
//         reviewController.deleteReview
//     );

// module.exports = router;
const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(reviewController.createReview);

router
    .route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview)
    .delete(reviewController.deleteReview);

module.exports = router;
