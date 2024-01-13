import path from 'node:path';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { MIME_TYPES } from '../constants.js';
import config from '../config.js';

export default async ({ pathToReturn }) => {
    const fileExtension = path.extname(pathToReturn).substring(1).toLowerCase();
    const { size } = await stat(pathToReturn);
    const mime =
        size >= config.maxFileSize || !MIME_TYPES[fileExtension]
            ? MIME_TYPES.default
            : MIME_TYPES[fileExtension];
    const rs = createReadStream(pathToReturn);
    return {
        mime,
        rs,
    };
};
