import { appendFile, readFile, stat, writeFile } from 'node:fs/promises';
import process from 'node:process';
import stream from 'node:stream';
import sizeState from './store.js';
import { getAbortSignal, getLine, getRawContentEntities, getResultFilePath } from './utils.js';
import { validateRequestedFileSize, validateSentencesFilePath } from './validations.js';
import { SENTENCES_FILE_NAME } from './constants.js';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import prettyBytes from 'pretty-bytes';

dayjs.extend(duration);

// make __dirname const available
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resultFilePath = getResultFilePath();

const main = async (sizeState) => {
    await createResulFile();
    await validateRequestedFileSize();
    await validateSentencesFilePath();

    const { sentencesFilePath, requestedFileSize } = pluckRequiredArgs();
    sizeState.max = requestedFileSize;
    const signal = getAbortSignal();
    const sentencesFile = path.resolve(sentencesFilePath, SENTENCES_FILE_NAME);
    const data = await readFile(sentencesFile, { signal, encoding: 'utf-8' });
    const contents = getRawContentEntities(data);

    await read(contents, signal);
};

main(sizeState).catch(console.error);

async function* refreshResultFileStat(sizeState) {
    try {
        while (sizeState.isCurrentSizeAcceptable) {
            const { size } = await stat(resultFilePath);
            sizeState.current = size;
            yield;
        }
    } catch (e) {
        console.error(e);
    }
}

function pluckRequiredArgs() {
    const [, , sentencesFilePath, requestedFileSizeArg] = process.argv;
    const requestedFileSize = Number(requestedFileSizeArg);
    return { sentencesFilePath, requestedFileSize };
}


async function appendResulFileWithRandomLine(contents, signal) {
    const line = getLine({ ...contents });
    await appendFile(resultFilePath, `${line}\n`, { signal });
}

async function createResulFile() {
    await writeFile(resultFilePath, '', { encoding: 'utf-8' });
}

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
        console.log(`The file with requested size ${prettyBytes(sizeState.max)} in bytes has been generated: ${resultFilePath}`);
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
