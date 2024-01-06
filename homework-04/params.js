import { argv } from 'node:process';

const {
    fileSize = 1024,
    sentences = './sentences.txt',
    result = './result.txt',
} = [argv[2], argv[3], argv[4]].filter(arg => arg.includes('=')).map(arg => arg.split('=')).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: value,
}), {});

export {
    fileSize,
    sentences,
    result,
};
