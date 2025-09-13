/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Please write a review']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Please provide a rating']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user']
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
