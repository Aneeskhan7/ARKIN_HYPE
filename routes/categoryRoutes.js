// /* eslint-disable prettier/prettier */

// const express = require('express');
// const categoryController = require('./../controllers/categoryController');
// const authController = require('./../controllers/authController');

// const router = express.Router();
// router.use(authController.protect);

// router
//     .route('/')
//     .get(categoryController.getAllCategories)
//     .post(
//         authController.restrictTo('admin'),
//         categoryController.uploadcategoryPhoto,
//         categoryController.createCategory
//         );
// router
//     .route('/:id')
//     .get(categoryController.getCategory)
//     .patch(categoryController.updateCategory)
//     .delete(
//         authController.protect,
//         authController.restrictTo('admin'),
//         categoryController.deleteCategory
//     );

// module.exports = router;

/* eslint-disable prettier/prettier */

const express = require('express');
const categoryController = require('./../controllers/categoryController');
const authController = require('./../controllers/authController');

const router = express.Router();
router.use(authController.protect);

router
    .route('/')
    .get(categoryController.getAllCategories)
    .post(
        authController.restrictTo('admin'),
        categoryController.uploadcategoryPhoto,
        categoryController.createCategory,
    );
router
    .route('/:id')
    .get(categoryController.getCategory)
    .patch(categoryController.updateCategory)
    .delete(
        // authController.protect,
        authController.restrictTo('admin'),
        categoryController.deleteCategory
    );

module.exports = router;

















