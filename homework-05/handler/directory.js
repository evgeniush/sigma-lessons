import path from 'node:path';
import { MIME_TYPES } from '../constants.js';
import { readdir } from 'node:fs/promises';
import stream from 'node:stream';
import { getUrlInfos } from '../utils.js';

export default async ({ pathToReturn, url }) => {
    const contents = await readdir(pathToReturn);
    const html = getHtml({ contents, url });
    const rs = stream.Readable.from(html);
    return { mime: MIME_TYPES.html, rs };
};

function getHtml({ contents = [], url }) {
    const { parent = null, destination = '/' } = getUrlInfos(url);
    const getEntityPath = (ent) => path.join(destination, ent);
    const getEntityLink = (ent) =>
        `<li><a href="${getEntityPath(ent)}">${ent}</a></li>`;
    return [
        `<!DOCTYPE html>`,
        `<html>`,
        `<head><link rel="icon" href="data:,"><title>File explorer</title></head>`,
        `<body>`,
        `<h2>File explorer</h2>`,
        parent
            ? `<p>
                <a href="${path.join('../', parent)}">Go up</a>
            </p>`
            : null,
        `<ul>`,
        contents.map((ent) => getEntityLink(ent)).join(''),
        `</ul>`,
        `</body>`,
        `</html>`,
    ]
        .filter(Boolean)
        .join('');
}
