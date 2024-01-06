import { appendFile, readFile, stat } from 'node:fs/promises';
import stream from 'node:stream';
import sizeState from './store.js';
import { getAbortSignal, getLine, getRawContentEntities } from './utils.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import prettyBytes from 'pretty-bytes';
import { fileSize, result, sentences } from './params.js';
import { validateFilePath, validateRequestedFileSize } from './validations.js';

dayjs.extend(duration);

try {
    console.log(fileSize, result, sentences);
    const main = async (sizeState) => {
        await validateRequestedFileSize(fileSize);
        await validateFilePath(sentences, 'Sentences');
        await validateFilePath(result, 'Result');

        sizeState.max = Number(fileSize);
        const signal = getAbortSignal();
        const data = await readFile(sentences, { signal, encoding: 'utf-8' });
        const contents = getRawContentEntities(data);

        await read(contents, signal);
    };

    main(sizeState).catch(console.error);

    async function read(contents, signal) {
        console.log('Writing, be patient...');
        let start = Date.now();
        const readable = stream.Readable.from(refreshResultFileStat(sizeState));
        const onData = async () => {
            readable.pause();
            await appendResulFileWithRandomLine(contents, signal);
            readable.resume();
        };
        const onEnd = () => {
            let end = Date.now();
            const spentMilliseconds = end - start;
            const formattedSpentTime = dayjs.duration(spentMilliseconds).format('HH:mm:ss');
            console.log('Done!');
            console.log(`The file with requested size ${prettyBytes(sizeState.max)} in bytes has been generated: ${result}`);
            console.log(`Spent time: ${formattedSpentTime}`);
        };
        const onError = (err) => {
            signal.abort();
            throw err;
        };
        readable.on('data', onData);
        readable.on('end', onEnd);
        readable.on('error', onError);
    }
} catch (e) {
    console.error(e);
}

async function* refreshResultFileStat(sizeState) {
    try {
        while (sizeState.isCurrentSizeAcceptable) {
            const { size } = await stat(result);
            sizeState.current = size;
            yield;
        }
    } catch (e) {
        console.error(e);
    }
}

async function appendResulFileWithRandomLine(contents, signal) {
    const line = getLine({ ...contents });
    await appendFile(result, `${line}\n`, { signal });
}
