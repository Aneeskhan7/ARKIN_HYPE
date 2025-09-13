/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: [true, 'Please enter the Category Name'],

    },
    photo: {
        type: String,

    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    date: {
        type: Date,
        default: Date.now,
        select: false
    }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
