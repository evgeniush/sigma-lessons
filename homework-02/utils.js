export const toNumber = (str) => typeof str === 'number' ? str : Number(str);

export const takeRight = (arr, n = 1) => arr.slice(-n);

export const compose = (...fns) =>
    fns.reduce((f, g) => (...args) => f(g(...args)));
