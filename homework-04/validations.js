import { access } from 'node:fs/promises';
import process from 'node:process';
import path from 'node:path';

export async function validateRequestedFileSize() {
    const [, , , requestedFileSizeArg] = process.argv;
    const requestedFileSize = Number(requestedFileSizeArg);
    if (!requestedFileSizeArg || !Number.isFinite(requestedFileSize) || requestedFileSize === 0) {
        throw new Error('no requested file size provided');
    }
}


export async function validateSentencesFilePath() {
    const [, , sentencesFilePath] = process.argv;
    if (!sentencesFilePath) {
        throw new Error('no sentencesFilePath provided');
    }
    const sentencesFile = path.resolve(sentencesFilePath, 'sentences.txt');
    await access(sentencesFile);
}
