/* eslint-disable prettier/prettier */
const multer = require('multer');
const Category = require('../models/categoryModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/category');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `category-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadcategoryPhoto = upload.single('photo');

exports.getAllCategories = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Category.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const categories = await features.query;

    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: {
            categories
        }
    });
});

exports.getCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            category
        }
    });
});
exports.createCategory = catchAsync(async (req, res, next) => {
    console.log('Request Body:', req.body); // Add this line
    console.log('Request File:', req.file); // Add this line

    const { categoryName } = req.body;

    if (!categoryName) {
        return next(new AppError('Please enter the Category Name', 400));
    }

    let photoUrl = '';
    if (req.file) {
        const fileName = req.file.filename;
        const basepath = `${req.protocol}://${req.get('host')}/public/img/category/`;
        photoUrl = `${basepath}${fileName}`;
    }

    const newCategory = await Category.create({
       categoryName: req.body.categoryName,
//         photo: req.body.photo
    });

    res.status(201).json({
        status: 'success',
        data: {
            category: newCategory
        }
    });
});
// exports.createCategory = catchAsync(async (req, res, next) => {
//     if (!req.body.categoryName) {
//         return next(new AppError('Please enter the Category Name', 400));
//     }

//     if (req.file) {
//         const fileName = req.file.filename;
//         const basepath = `${req.protocol}://${req.get('host')}/public/img/category/`;
//         req.body.photo = `${basepath}${fileName}`;
//     }

//     const newCategory = await Category.create({
//         categoryName: req.body.categoryName,
//         photo: req.body.photo
//     });

//     res.status(201).json({
//         status: 'success',
//         data: {
//             category: newCategory
//         }
//     });
// });

exports.updateCategory = catchAsync(async (req, res, next) => {
    if (!req.body.categoryName) {
        return next(new AppError('Please enter the Category Name', 400));
    }

    if (req.file) {
        const fileName = req.file.filename;
        const basepath = `${req.protocol}://${req.get('host')}/public/img/category/`;
        req.body.photo = `${basepath}${fileName}`;
    }

    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            category
        }
    });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
