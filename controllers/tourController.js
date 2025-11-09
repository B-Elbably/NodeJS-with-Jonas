const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const aliasTopTours = (req, res, next) => {
    const q = { ...req.query };
    q.limit = q.limit || '5';
    q.sort = q.sort || 'price';
    q.fields = q.fields || 'name,price,ratingsAverage,summary,difficulty';
    req.validatedQuery = q;
    next();
};

const getAllTours = catchAsync(async (req, res, next) => {
    const q = req.validatedQuery || { ...req.query };
    // console.log('using query:', q);
    // TODO: Handle Query Features
    // ! Filering
    // const queryObj = { ...q };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);

    // let queryStr = JSON.stringify(queryObj);
    // queryStr = queryStr.replace(
    //     /\b(gte|gt|lte|lt)\b/g,
    //     (match) => `$${match}`,
    // );

    // let query = Tour.find(JSON.parse(queryStr));

    // !  Sorting
    // if (q.sort) {
    //     const sortBy = q.sort.split(',').join(' ');
    //     query = query.sort(sortBy);
    // } else {
    //     query = query.sort('-createdAt');
    // }
    // !  Field Limiting
    // if (q.fields) {
    //     const fields = q.fields.split(',').join(' ');
    //     query = query.select(fields);
    // } else {
    //     query = query.select('-__v');
    // }
    // !  Pagination
    // const page = q.page * 1 || 1;
    // const limit = q.limit * 1 || 100;
    // const skip = (page - 1) * limit;

    // query = query.skip(skip).limit(limit);
    // if (q.page) {
    //     const numTours = await Tour.countDocuments();
    //     if (skip >= numTours) throw new Error('This page does not exist');
    // }
    // !  Execute Query
    // const tours = await query;
    // console.log(tours.length);

    const features = new APIFeatures(Tour.find(), q)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const tours = await features.query;
    console.log(tours.length);
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours },
    });
});

const getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    // const tour = await Tour.findOne({ _id: req.params.id });
    if (!tour) {
        return next(new AppError('Invalid ID', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

const createTour = catchAsync(async (req, res, next) => {
    // const newTour = new Tour({});
    // newTour.save();
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            tour: newTour,
        },
    });
});

const updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }
    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

const deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return next(new AppError('Not tour found ID', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

// Aggregation Pipeline
const getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } },
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' },
                avgRating: { $avg: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
            },
        },
        {
            $sort: { avgPrice: 1 },
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } },
        // },
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats,
        },
    });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates',
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            },
        },
        {
            $group: {
                _id: { $month: '$startDates' },
                numToursStarts: { $sum: 1 },
                tours: { $push: '$name' },
            },
        },
        {
            $addFields: { month: '$_id' },
        },
        {
            $project: {
                _id: 0,
            },
        },
        {
            $sort: { numToursStarts: -1 },
        },
        {
            $limit: 12,
        },
    ]);

    res.status(200).json({
        status: 'success',
        data: {
            planLength: plan.length,
            plan,
        },
    });
});

module.exports = {
    getMonthlyPlan,
    getTourStats,
    aliasTopTours,
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
};

// TODO : TESTING Data from json file
// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev/data/tours-simple.json`, 'utf-8'),
// );

// TASK : Middlewares
// const checkID = (req, res, next, val) => {
//     console.log(`Tour id is ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID',
//         });
//     }
//     next();
// };

// const checkBody = (req, res, next, val) => {
//     if (!req.params.price || !req.params.name) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price',
//         });
//     }
//     next();
// };

// // TASK: Tours Handlers
// const getAllTours = (req, res) => {
//     // console.log(req.requestTime);
//     res.status(200).json({
//         status: 'success',
//         // requestedAt : req.requestTime,
//         results: tours.length,
//         data: {
//             tours,
//         },
//     });
// };

// const getTour = (req, res) => {
//     const id = req.params.id * 1;
//     const tour = tours.find((el) => el.id === id);

//     // This should not happen due to checkID middleware, but adding as safety
//     if (!tour) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID',
//         });
//     }

//     res.status(200).json({
//         status: 'success',
//         data: {
//             tour,
//         },
//     });
// };

// const createTour = (req, res) => {
//     // console.log(req.body);
//     const newID = tours[tours.length - 1].id + 1;
//     // eslint-disable-next-line prefer-object-spread
//     const newTour = Object.assign({ id: newID }, req.body);
//     tours.push(newTour);
//     fs.writeFile(
//         `${__dirname}/../dev/data/tours-simple.json`,
//         JSON.stringify(tours),
//         () => {
//             res.status(201).json({
//                 status: 'success',
//                 data: {
//                     tour: newTour,
//                 },
//             });
//         },
//     );
// };

// const updateTour = (req, res) => {
//     const id = req.params.id * 1;
//     this.checkID();

//     const tour = tours.find((el) => el.id === id);
//     const updates = req.body;
//     const allowedKeys = Object.keys(tour);
//     const invalidKeys = Object.keys(updates).filter(
//         (k) => !allowedKeys.includes(k),
//     );

//     if (invalidKeys.length > 0) {
//         return res.status(400).json({
//             status: 'fail',
//             message: `Invalid fields: ${invalidKeys.join(', ')}`,
//         });
//     }

//     Object.assign(tour, updates);

//     fs.writeFile(
//         `${__dirname}/../dev/data/tours-simple.json`,
//         JSON.stringify(tours),
//         (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     status: 'error',
//                     message: 'Failed to save update',
//                 });
//             }
//             res.status(200).json({
//                 status: 'success',
//                 message: 'updated',
//             });
//         },
//     );
// };

// const deleteTour = (req, res) => {
//     fs.writeFile(
//         `${__dirname}/../dev/data/tours-simple.json`,
//         JSON.stringify(tours),
//         (err) => {
//             if (err) {
//                 return res.status(500).json({
//                     status: 'error',
//                     message: 'Failed to delete',
//                 });
//             }
//             res.status(204).json({
//                 status: 'success',
//                 data: null,
//             });
//         },
//     );
// };
