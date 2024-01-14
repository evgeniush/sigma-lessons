import path from 'node:path';
import { access, lstat } from 'node:fs/promises';
import { MIME_TYPES } from './constants.js';

export async function getRequestedPathValidity(resourcePath) {
    const isAccessible = await access(resourcePath).then(
        () => true,
        () => false
    );
    if (!isAccessible) {
        return false;
    }
    const [isFile] = await getResourceInfo(resourcePath);
    const fileExtension = isFile
        ? path.extname(resourcePath).substring(1).toLowerCase()
        : 'html';
    const isAllowedExtension = Boolean(MIME_TYPES[fileExtension]);
    const isAllowedPath = resourcePath.startsWith(process.cwd());

    return [isAccessible, isAllowedPath, isAllowedExtension].every((v) => v);
}

export function getUrlInfos(url) {
    const decodedUrl = decodeURIComponent(url);
    const segments = decodedUrl.substring(1).split('/').filter(Boolean);
    const parent =
        segments.length > 1
            ? segments[segments.length - 2]
            : segments.length === 1
              ? '/'
              : null;
    const destination = [...segments].pop();
    const requestedPath = path.normalize([process.cwd(), decodedUrl].join('/'));
    return { destination, parent, segments, requestedPath };
}

export async function getResourceInfo(resource) {
    const stat = await lstat(resource);
    return [stat.isFile(), stat.isDirectory()];
}
