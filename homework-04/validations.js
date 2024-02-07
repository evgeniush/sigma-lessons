import { access } from 'node:fs/promises';

export async function validateRequestedFileSize(str) {
    const requestedFileSize = Number(str);
    if ([
        !str,
        !Number.isFinite(requestedFileSize),
        requestedFileSize === 0,
    ].some(v => v)) {
        throw new Error('No valid requested file size provided');
    }
}

export async function validateFilePath(str, purpose) {
    try {
        await access(str);
    } catch {
        throw new Error(`No valid ${purpose} file path provided`);
    }
}
