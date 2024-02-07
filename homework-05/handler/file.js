import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { MIME_TYPES } from '../constants.js';
import config from '../config.js';

export default async ({ pathToReturn }) => {
    const fileExtension = path.extname(pathToReturn).substring(1).toLowerCase();
    console.log(fileExtension);
    const { size } = await stat(pathToReturn);
    const t = MIME_TYPES[fileExtension];
    const test = Boolean(MIME_TYPES[fileExtension]); // ?
    const mime =
        new Map([
            [size >= config.maxFileSize, MIME_TYPES.default],
            [Boolean(MIME_TYPES[fileExtension]), MIME_TYPES[fileExtension]],
        ]).get(true) ?? MIME_TYPES.default;
    const rs = createReadStream(pathToReturn);
    return {
        mime,
        rs,
    };
};
