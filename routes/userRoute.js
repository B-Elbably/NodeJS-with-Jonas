const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
} = userController;

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch(
    '/updateMyPassword',
    authController.protect,
    authController.updatePassword,
);

router
    .route('/')
    .get(getAllUsers)
    .post(createUser)
    .delete(authController.protect, deleteAllUsers);

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(
        authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        deleteUser,
    );

module.exports = router;
