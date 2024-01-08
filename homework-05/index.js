import { createServer } from 'http';
import path, { dirname } from 'node:path';
import { readFile } from 'node:fs/promises';
import { promises as fsp } from 'node:fs';
import { fileURLToPath } from 'node:url';

// make __dirname const available
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 8181;

createServer(async (req, res) => {
    const files = await fsp.readdir(path.resolve(__dirname));
    console.log(files);
    // const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join('./homework-05', '/index.html');
    try {
        const data = await readFile(filePath);
        res.end(data);
    } catch (err) {
        res.statusCode = 404;
        res.end('"File is not found"');
    }
}).listen(PORT);

console.log(`server started at port ${PORT}`);
