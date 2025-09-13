/* eslint-disable import/extensions */
/* eslint-disable prettier/prettier */
// routes/withdrawalRoutes.js
const express = require('express');
const withdrawalController = require('../controllers/withdrawalController'); // Ensure this path is correct
const authController = require('../controllers/authController');

const router = express.Router();

router.post(
    '/',
    authController.protect,
    withdrawalController.createWithdrawal
);

router
    .route('/')
    .get(authController.protect, withdrawalController.getAllWithdrawals);

router
    .route('/:id')
    .get(authController.protect, withdrawalController.getWithdrawal)
    .patch(authController.protect, authController.restrictTo('admin'), withdrawalController.updateWithdrawal)
    .delete(authController.protect, authController.restrictTo('admin'), withdrawalController.deleteWithdrawal);

router.patch(
    '/:id/approve',
    authController.protect,
    authController.restrictTo('admin'),
    withdrawalController.approveWithdrawal
);

router.patch(
    '/:id/reject',
    authController.protect,
    authController.restrictTo('admin'),
    withdrawalController.rejectWithdrawal
);

module.exports = router;
