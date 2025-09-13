/* eslint-disable no-undef */
/* eslint-disable import/order */
/* eslint-disable no-use-before-define */
/* eslint-disable prettier/prettier */

const multer = require('multer');
const mime = require('mime-types');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const schedule = require('node-schedule');

// Multer setup for user photo upload
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
  if (allowedMimeTypes.includes(mime.lookup(file.originalname))) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
  }

  const filteredBody = filterObj(req.body, 'fullname', 'email', 'address', 'phone', 'status', 'photo');
  if (req.file) {
    const fileName = req.file.filename;
    const basepath = `${req.protocol}://${req.get('host')}/public/img/users/`;
    filteredBody.photo = `${basepath}${fileName}`;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user.id);

  if (!user) {
    return next(new AppError('No user found with this ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead'
  });
};

exports.approveUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  // Approve the user
  user.isApproved = true;
  user.trialbalance = 50; // Set the trial balance when approved
  user.trialStartTime = new Date(); // Set the trial start time
  await user.save({ validateBeforeSave: false });

  // Schedule the trial balance reset after 4 minutes
  scheduleBalanceReset(user._id, user.trialStartTime);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});


// Function to schedule the reset of trial balance after 4 minutes
function scheduleBalanceReset(userId, trialStartTime) {
  const resetTime = new Date(trialStartTime.getTime() + 4 * 60 * 1000); // 4 minutes from trialStartTime
  console.log(`Scheduling trial balance reset for user ${userId} at ${resetTime}`); // Add this log
  schedule.scheduleJob(resetTime, async function () {
    const user = await User.findById(userId);
    if (user && user.trialbalance > 0) {
      user.trialbalance = 0; // Set trial balance to 0 after 4 minutes
      await user.save({ validateBeforeSave: false });
      console.log(`Trial balance reset to 0 for user ${userId}`); // Add this log
    }
  });
}




module.exports.scheduleBalanceReset = scheduleBalanceReset;

exports.setReviewLimit = catchAsync(async (req, res, next) => {
  const { userId, reviewLimit } = req.body;

  if (!userId || !reviewLimit) {
    return next(new AppError('Please provide userId and reviewLimit', 400));
  }

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  user.reviewsAllowed = reviewLimit;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
