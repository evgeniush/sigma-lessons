import { add, div, mul, sub } from './operations.js';
import { compose, takeRight, toNumber } from './utils.js';
import validate from './validations.js';
import { argv } from 'node:process';

const operationsMap = new Map([
    ['add', add],
    ['div', compose(div, validate.div)],
    ['sub', sub],
    ['mul', mul],
]);

const [, , operation] = argv;
validate.operation(operation, operationsMap);
const transformInputToArg = compose(toNumber, validate.inputParam);
const [a, b] = takeRight(argv, 2).map(transformInputToArg);

const result = operationsMap.get(operation)([a, b]);

console.log(`You're trying to ${operation} with ${a} and ${b}`);
console.log('Calculation result is: ', result);
