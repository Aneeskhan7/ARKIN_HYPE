/* eslint-disable no-unused-vars */
/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
const Review = require('../models/reviewModel');
const multer = require('multer');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const Product = require('./../models/productModel');
const schedule = require('node-schedule');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/review');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `review-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadReviewPhoto = upload.single('photo');

exports.getAllReviews = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Review.find().populate({
        path: 'product',
        select: 'productName photo'
    }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const reviews = await features.query;

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

exports.getReview = catchAsync(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
});
exports.createReview = catchAsync(async (req, res, next) => {
    const { review, rating, productId } = req.body;

    if (!review || !rating || !productId) {
        return next(new AppError('Please provide review, rating, and productId', 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    // Calculate the review value based on the product's review percentage
    const reviewValue = (product.price * product.productReviewPercentage) / 100;

    // Trial Phase (Before 30 Reviews)
    if (user.reviewsUsed < 30) {
        // Add to trial reward only
        user.trialReward += reviewValue;

        // Increment the number of reviews used
        user.reviewsUsed += 1;

        // If 30 reviews have been completed, set the trial balance to 0
        if (user.reviewsUsed >= 30) {
            user.trialbalance = 0; // Trial balance becomes zero after 30 reviews
        }
    } else {
        // Post-Trial Phase (After 30 Reviews)

        // Check if the user has enough balance (balance should not be zero)
        if (user.balance <= 0) {
            return next(new AppError('Insufficient balance to submit this review.', 400));
        }

        // If user has enough balance, proceed with adding reward to both balance and rewards
        user.balance += reviewValue; // Add review value to the balance
        user.rewards += reviewValue; // Add review value to the rewards

        // Note: No balance deduction here since we are adding the reward to the balance and reward
    }

    // Save the updated user details
    await user.save({ validateBeforeSave: false });

    // Create the new review
    const newReview = await Review.create({
        review,
        rating,
        user: req.user._id,
        product: productId
    });

    // Return the response with the new review and the status of reviews used
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview,
            reviewsCompleted: user.reviewsUsed, // Return how many reviews have been completed
            reviewsRemaining: Math.max(30 - user.reviewsUsed, 0) // Return how many reviews are left for the trial phase
        }
    });
});







// exports.createReview = catchAsync(async (req, res, next) => {
//     const { review, rating, productId } = req.body;

//     if (!review || !rating || !productId) {
//         return next(new AppError('Please provide review, rating, and productId', 400));
//     }

//     const user = await User.findById(req.user._id);
//     if (!user) {
//         return next(new AppError('User not found', 404));
//     }

//     const product = await Product.findById(productId);
//     if (!product) {
//         return next(new AppError('Product not found', 404));
//     }

//     // Calculate the review value based on the product's review percentage
//     const reviewValue = (product.price * product.productReviewPercentage) / 100;

//     if (user.trialbalance >= reviewValue) {
//         // Sufficient trial balance: Proceed with trial review
//         user.trialbalance -= reviewValue;
//         user.trialReward += reviewValue;
//     } else {
//         // Insufficient trial balance: Fallback to normal review logic
//         const remainingTrialBalance = user.trialbalance;
//         const remainingReviewValue = reviewValue - remainingTrialBalance;

//         user.trialReward += remainingTrialBalance;
//         user.trialbalance = 0;

//         if (user.balance < remainingReviewValue) {
//             return next(new AppError('Insufficient balance for normal review.', 400));
//         }

//         user.rewards += remainingReviewValue;
//         user.balance += remainingReviewValue;
//     }

//     // Update the review count
//     if (user.reviewsAllowed > 0) {
//         user.reviewsAllowed -= 1;
//         user.reviewsUsed += 1;
//     }

//     // Calculate and update the total balance
//     user.totalBalance = user.balance + user.rewards;

//     await user.save({ validateBeforeSave: false });

//     const newReview = await Review.create({
//         review,
//         rating,
//         user: req.user._id,
//         product: productId
//     });

//     res.status(201).json({
//         status: 'success',
//         data: {
//             review: newReview
//         }
//     });
// });

exports.updateReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
