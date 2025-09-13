/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Please enter the Product Name'],
        unique: true,
        trim: true
    },
    photo: {
        type: String,
        required: [true, 'Please provide a photo'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please enter the Product Model'],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    //    productType: {
    //         type: String,
    //         enum: ['Standard', 'Premium'],
    //         required: true,
    //          default: 'Standard'
    //     },
    price: {
        type: Number,
        required: [true, 'Please enter the Product Price']
    },
    productReviewPercentage: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    date: {
        type: Date,
        default: Date.now,
        select: false
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
