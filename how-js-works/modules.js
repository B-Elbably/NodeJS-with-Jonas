// console.log(arguments);
// console.log(require('module').wrapper);

// module.exports
const Calculator = require('./test-module-1');
const calc1 = new Calculator();
console.log(calc1.divide(3, 2));

// exports
const calc2 = require('./test-module-2');
console.log(calc2.multiply(3, 2));

const {add , divide} = require('./test-module-2');
console.log(add(3, 2));

// caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();
