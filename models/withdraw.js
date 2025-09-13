/* eslint-disable prettier/prettier */
// models/withdrawalModel.js
const mongoose = require('mongoose');

const withdrawalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount']
    },
    payment: {
        type: String,
        required: [true, 'Please provide a payment method']
    },
    walletAddress: {
        type: String,
        required: [true, 'Please provide a wallet address']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Withdrawal must belong to a user']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = Withdrawal;
