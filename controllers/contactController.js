/* eslint-disable prettier/prettier */
// controllers/contactController.js
const Contact = require('../models/contactModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createContact = catchAsync(async (req, res, next) => {
    const { name, email, message } = req.body;

    const newContact = await Contact.create({
        name,
        email,
        message
    });

    res.status(201).json({
        status: 'success',
        data: {
            contact: newContact
        }
    });
});

exports.getAllContacts = catchAsync(async (req, res, next) => {
    const contacts = await Contact.find();

    res.status(200).json({
        status: 'success',
        results: contacts.length,
        data: {
            contacts
        }
    });
});

exports.getContact = catchAsync(async (req, res, next) => {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
        return next(new AppError('No contact found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            contact
        }
    });
});

exports.updateContact = catchAsync(async (req, res, next) => {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!contact) {
        return next(new AppError('No contact found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            contact
        }
    });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
        return next(new AppError('No contact found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
