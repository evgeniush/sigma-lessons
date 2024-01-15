import { readFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import stream from 'node:stream';
import sizeState from './store.js';
import { getLine, getRawContentEntities } from './utils.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import prettyBytes from 'pretty-bytes';
import { fileSize, result, sentences } from './params.js';
import { validateFilePath, validateRequestedFileSize } from './validations.js';

dayjs.extend(duration);

try {
    const generate = async (sizeState) => {
        await validateRequestedFileSize(fileSize);
        await validateFilePath(sentences, 'Sentences');
        await validateFilePath(result, 'Result');

        sizeState.max = Number(fileSize);
        const data = await readFile(sentences, { encoding: 'utf-8' });
        const contents = getRawContentEntities(data);

        await read(contents);
    };

    generate(sizeState).catch(console.error);

    async function read(contents) {
        console.log('Writing, be patient...');
        let start = Date.now();
        const readable = stream.Readable.from(
            readNextLine(sizeState, contents)
        );
        const writable = createWriteStream(result);

        const handleError = () => {
            readable.destroy();
            writable.end('Terminated with error...');
            throw new Error('Writing result file has been terminated');
        };

        const handleEnd = () => {
            let end = Date.now();
            const spentMilliseconds = end - start;
            const formattedSpentTime = dayjs
                .duration(spentMilliseconds)
                .format('HH:mm:ss');
            console.log('Done!');
            console.log(
                `The file with requested size ${prettyBytes(
                    sizeState.max
                )} in bytes has been generated: ${result}`
            );
            console.log(`Spent time on writing: ${formattedSpentTime}`);
        };

        readable.on('end', handleEnd).on('error', handleError).pipe(writable);
    }
} catch (e) {
    console.error(e);
}

async function* readNextLine(sizeState, contents) {
    try {
        while (sizeState.isFileSizeAcceptable) {
            const line = `${getLine({ ...contents })}\n`;
            sizeState.counter = Buffer.byteLength(line);
            yield line;
        }
    } catch (e) {
        console.error(e);
    }
}
