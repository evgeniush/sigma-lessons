export const throwErr = (message = '', argument = '') => {
    throw new Error(`${message} ${argument}`);
};
