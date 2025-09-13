/* eslint-disable prettier/prettier */
const Withdrawal = require('../models/withdraw');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createWithdrawal = catchAsync(async (req, res, next) => {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);

    if (amount > user.totalBalance) {
        return next(new AppError('Withdrawal amount exceeds total balance', 400));
    }

    const withdrawal = await Withdrawal.create({
        ...req.body,
        user: req.user.id
    });

    res.status(201).json({
        status: 'success',
        data: {
            withdrawal
        }
    });
});

exports.getWithdrawal = catchAsync(async (req, res, next) => {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
        return next(new AppError('No withdrawal found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            withdrawal
        }
    });
});

exports.getAllWithdrawals = catchAsync(async (req, res, next) => {
    const withdrawals = await Withdrawal.find();

    res.status(200).json({
        status: 'success',
        results: withdrawals.length,
        data: {
            withdrawals
        }
    });
});

exports.updateWithdrawal = catchAsync(async (req, res, next) => {
    const withdrawal = await Withdrawal.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!withdrawal) {
        return next(new AppError('No withdrawal found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            withdrawal
        }
    });
});

exports.deleteWithdrawal = catchAsync(async (req, res, next) => {
    const withdrawal = await Withdrawal.findByIdAndDelete(req.params.id);

    if (!withdrawal) {
        return next(new AppError('No withdrawal found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.approveWithdrawal = catchAsync(async (req, res, next) => {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
        return next(new AppError('No withdrawal found with that ID', 404));
    }

    const user = await User.findById(withdrawal.user);
    if (withdrawal.amount > user.totalBalance) {
        return next(new AppError('Withdrawal amount exceeds total balance', 400));
    }

    user.totalBalance -= withdrawal.amount;
    user.totalWithdraw += withdrawal.amount;
    await user.save({ validateBeforeSave: false });

    withdrawal.status = 'approved';
    await withdrawal.save();

    res.status(200).json({
        status: 'success',
        data: {
            withdrawal
        }
    });
});

exports.rejectWithdrawal = catchAsync(async (req, res, next) => {
    const withdrawal = await Withdrawal.findById(req.params.id);
    if (!withdrawal) {
        return next(new AppError('No withdrawal found with that ID', 404));
    }

    withdrawal.status = 'rejected';
    await withdrawal.save();

    res.status(200).json({
        status: 'success',
        data: {
            withdrawal
        }
    });
});
