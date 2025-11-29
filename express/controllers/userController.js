const User = require('../models/userModel');
// const APIFeatures = require('../utils/apiFeatures');
const { catchAsync } = require('../utils/catchAsync');

const getAllUsers = catchAsync(async (req, res) => {
    const users = await User.find();
    console.log(users.length);
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: { users },
    });
});

const getUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!',
    });
};

const deleteAllUsers = catchAsync(async (req, res) => {
    await User.deleteMany();
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers,
};
