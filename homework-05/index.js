import { createServer } from 'http';
import config from './config.js';
import {
    getRequestedPathValidity,
    getResourceInfo,
    getUrlInfos,
} from './utils.js';
import handler from './handler/index.js';

const PORT = process.env.PORT || config.port;

createServer(async (req, res) => {
    try {
        const { url } = req;
        console.log(`Requested ${url}`);
        const { requestedPath } = getUrlInfos(url);
        const isRequestedPathValid =
            await getRequestedPathValidity(requestedPath);
        const statusCode = isRequestedPathValid ? 200 : 404;
        const pathToReturn = isRequestedPathValid ? requestedPath : '404.html';
        const [isFile, isDirectory] = await getResourceInfo(pathToReturn);
        const entity = new Map([
            [isFile, 'file'],
            [isDirectory, 'directory'],
        ]).get(true);
        const { mime, rs } = await handler[entity]({ pathToReturn, url });
        res.writeHead(statusCode, { 'Content-Type': mime });
        console.log(`Response ${statusCode} ${pathToReturn}`);
        rs.pipe(res);
    } catch (e) {
        console.error(e);
        res.writeHead(500);
        res.end(`Server crashed: ${e?.message} ${req.url}`);
    }
}).listen(PORT);
console.log(`Server started at port ${PORT}`);
