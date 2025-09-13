/* eslint-disable import/order */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/product');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `product-${Date.now()}.${ext}`);
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

exports.uploadproductPhoto = upload.single('photo');

// Get all products
exports.getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Product.find().populate('category');

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: {
            products
        }
    });
});

// Get one product by ID
exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});

// Create a new product
exports.createProduct = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.body.category);
    if (!category) {
        return next(new AppError('Invalid category or category ID not found', 400));
    }

    if (req.file) {
        const fileName = req.file.filename
        const basepath = `${req.protocol}://${req.get('host')}/public/img/product/`;
        req.body.photo = `${basepath}${fileName}`
    }

    const newProduct = await Product.create({
        ...req.body,
        category: category._id
    });

    res.status(201).json({
        status: 'success',
        data: {
            product: newProduct
        }
    });
});

// Update a product
exports.updateProduct = catchAsync(async (req, res, next) => {
   if (req.file) {
        const fileName = req.file.filename
        const basepath = `${req.protocol}://${req.get('host')}/public/img/product/`;
        req.body.photo = `${basepath}${fileName}`
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    });
});

// Delete a product by ID
exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});
