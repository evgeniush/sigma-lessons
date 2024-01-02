import { throwErr } from './error.js';
import { toNumber } from './utils.js';

const validate = {
    inputParam(input) {
        if (Number.isFinite(toNumber(input))) {
            return input;
        }
        throwErr(`Provided argument should be of valid number: `, input);
    },
    div([a, b]) {
        const isForbiddenDevider = b === 0;
        if (isForbiddenDevider) {
            throwErr(`Cannot divide by zero`);
        }
        return [a, b];
    },
    operation(operation = '', operationsMap = new Map()) {
        const isKnownOperation = operationsMap.has(operation);
        if (!isKnownOperation) {
            throwErr('Please provide one of the four know calc func: add, div, mul, sub');
        }
    },
};

export default validate;
