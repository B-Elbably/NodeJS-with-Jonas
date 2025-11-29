<<<<<<< HEAD
exports.catchAsync = (fn) => (req, res, next) => {
=======
module.exports = (fn) => (req, res, next) => {
>>>>>>> 3cbeeb6 (until authorization start)
    fn(req, res, next).catch(next);
};
