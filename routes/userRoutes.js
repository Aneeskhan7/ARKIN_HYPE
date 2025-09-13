/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();
// User authentication routes
router.post('/signup', userController.uploadUserPhoto, authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);
// router.use(userController.checkAndResetTrialBalance);
// User management routes
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.uploadUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Admin routes
router.use(authController.restrictTo('admin'));

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.patch('/approveUser/:id', authController.restrictTo('admin'), userController.approveUser);

module.exports = router;
