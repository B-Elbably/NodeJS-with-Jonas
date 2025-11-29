const express = require('express');
const morgan = require('morgan');

const app = express();

// TASK: Serving static files
// const overview = fs.readFileSync(`${__dirname}/public/overview.html`, 'utf-8');
app.use(express.static(`${__dirname}/public`));

// TASK: ... Routes
const toursRouter = require('./routes/tourRoute');
const usersRouter = require('./routes/userRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// INFO: Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// TEMP: ==================================================
app.get(['/', '/overview'], (req, res) => {
    res.status(200).redirect('/overview.html');
});
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

// TEMP: ==================================================
// INFO: API (CRUD) Operations (Routed to tourRoute.js & userRoute.js)
// app.get('/api/v1/tours', getAllTours); // TODO: GET All Tours
// app.route('/api/v1/tours').get(getAllTours); // TODO: GET All Tours (Route)
// app.get('/api/v1/tours/:id', getTour); // TODO: GET Tour By ID
// app.post('/api/v1/tours', createTour); // TODO: Create Tour (POST)
// app.patch('/api/v1/tours/:id', updateTour); // TODO: Update Tour By ID (PATCH)
// app.delete('/api/v1/tours/:id', deleteTour); // TODO: Delete Tour By ID (DELETE)

// TODO: ROUTES
// INFO: (moved to routes/tourRoute.js & routes/userRoute.js)
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// TODO: ERROR HANDLING FOR UNHANDLED ROUTES
app.use((req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.statusCode = 404;
    // err.status = 'fail';
    // next(err);
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// TODO: Listen Server
// INFO : (moved to server.js)
module.exports = app;
