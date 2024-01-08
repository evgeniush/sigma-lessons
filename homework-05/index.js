import { createServer } from 'http';
import path, { dirname } from 'node:path';
import { readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createReadStream } from 'fs';


const PORT = process.env.PORT || 8181;

// make __dirname const available
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

createServer(async (req, res) => {
    try {
        const { method, url } = req;
        const [name, id] = url.substring(1).split('/');
        console.log(url);
        if (name.includes('.')) {
            const rs = createReadStream(path.resolve(__dirname, name));
            rs.on('error', () => {
                res.writeHead(500);
                res.end('No file found');
            });
            rs.pipe(res);
        } else {
            const folder = await readdir(path.resolve(__dirname, name));
            if (!folder) {
                res.writeHead(500);
                return void res.end('Folder not found');
            }
            // const rs = fs.createReadStream(path.resolve(__dirname, filename));
            console.log(folder);
            const filteredContents = folder.filter(entity => ![
                '.DS_Store',
                'node_modules',
                'package-lock.json',
                'favicon.ico',
                'client.js',
                'index.js',
                'package.json',
            ].includes(entity)).map(ent => `<li><a href="${name}/${ent}">${ent}</a></li>`).join('');
            const html = `<!DOCTYPE html>
            <html>
                <head>
                    <title>File explorer</title>
                </head>
            <body>
                  <h2>File explorer</h2>
                  <ul>${filteredContents.toString()}</ul>
            </body>
            </html>
        `;
            res.setHeader('Content-Type', 'text/html');
            res.end(filteredContents);
        }

    } catch (e) {
        console.error(e);
        res.writeHead(500);
        res.end(`Server crashed`);
    }

}).listen(PORT);
console.log(`Server started at port ${PORT}`);
