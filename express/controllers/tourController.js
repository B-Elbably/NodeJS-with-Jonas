const fs = require('fs');
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev/data/tours-simple.json`, 'utf-8'),
);

// TASK : Middlewares
const checkID = (req, res, next, val) => {
    console.log(`Tour id is ${val}`);
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID',
        });
    }
    next();
};

const checkBody = (req, res, next, val) => {
    if (!req.params.price || !req.params.name) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price',
        });
    }
    next();
};

// TASK: Tours Handlers
const getAllTours = (req, res) => {
    // console.log(req.requestTime);
    res.status(200).json({
        status: 'success',
        // requestedAt : req.requestTime,
        results: tours.length,
        data: {
            tours,
        },
    });
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    // This should not happen due to checkID middleware, but adding as safety
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
};

const createTour = (req, res) => {
    // console.log(req.body);
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newID }, req.body);
    tours.push(newTour);
    fs.writeFile(
        `${__dirname}/../dev/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: 'success',
                data: {
                    tour: newTour,
                },
            });
        },
    );
};

const updateTour = (req, res) => {
    const id = req.params.id * 1;
    this.checkID();

    const tour = tours.find((el) => el.id === id);
    const updates = req.body;
    const allowedKeys = Object.keys(tour);
    const invalidKeys = Object.keys(updates).filter(
        (k) => !allowedKeys.includes(k),
    );

    if (invalidKeys.length > 0) {
        return res.status(400).json({
            status: 'fail',
            message: `Invalid fields: ${invalidKeys.join(', ')}`,
        });
    }

    Object.assign(tour, updates);

    fs.writeFile(
        `${__dirname}/../dev/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to save update',
                });
            }
            res.status(200).json({
                status: 'success',
                message: 'updated',
            });
        },
    );
};

const deleteTour = (req, res) => {
    fs.writeFile(
        `${__dirname}/../dev/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            if (err) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to delete',
                });
            }
            res.status(204).json({
                status: 'success',
                data: null,
            });
        },
    );
};

module.exports = {
    checkID,
    checkBody,
    getAllTours,
    getTour,
    createTour,
    updateTour,
    deleteTour,
};
