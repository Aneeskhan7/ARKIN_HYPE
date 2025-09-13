/* eslint-disable prettier/prettier */
// routes/contactRoutes.js
const express = require('express');
const contactController = require('../controllers/contactController');
const authController = require('../controllers/authController');

const router = express.Router();

router
    .route('/')
    .post(contactController.createContact)
    .get(authController.protect, authController.restrictTo('admin'), contactController.getAllContacts);

router
    .route('/:id')
    .get(authController.protect, authController.restrictTo('admin'), contactController.getContact)
    .patch(authController.protect, authController.restrictTo('admin'), contactController.updateContact)
    .delete(authController.protect, authController.restrictTo('admin'), contactController.deleteContact);

module.exports = router;
