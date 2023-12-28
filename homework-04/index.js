import { appendFile, readFile, stat, writeFile } from 'node:fs/promises';
import process from 'node:process';
import stream from 'node:stream';
import sizeState from './store.js';
import { getAbortSignal, getLine, getRawContentEntities } from './utils.js';
import { validateRequestedFileSize, validateSentencesFilePath } from './validations.js';
import { RESULT_FILE_NAME, SENTENCES_FILE_NAME, TASK_FOLDER } from './constants.js';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// make __dirname const available
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
            const { size } = await stat(getResultFilePath());
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
    await appendFile(getResultFilePath(), `${line}\n`, { signal });
}

async function createResulFile() {
    await writeFile(getResultFilePath(), '', { encoding: 'utf-8' });
}

async function read(contents, signal) {
    const readable = stream.Readable.from(refreshResultFileStat(sizeState));
    const onData = async () => {
        readable.pause();
        await appendResulFileWithRandomLine(contents, signal);
        readable.resume();
    };
    const onEnd = () => {
        console.log('the file with requested size has been generated: ', getResultFilePath());
        // signal.abort();
    };

    readable.on('data', onData);
    readable.on('end', onEnd);
}

function getResultFilePath() {
    return path.resolve(TASK_FOLDER, RESULT_FILE_NAME);
}

// Генерація текстового файлу заданого розміру, що містить випадковий набір визначених речень (речення зазначені у файлі sentences.txt)
// Підрахунок кількості слів у заданому текстовому файлі файлі.

// Програма має надавати дві команди, які виконують наступні дії:
//
//     Генерація Файлу:
//     Програма повинна приймати шлях до файлу із заданим списком речень та бажаний розмір файлу як вхідні параметри.
//     Речення повинні бути розміщені у файлі у випадковому порядку.
//     Генерація має тривати до тих пір, поки розмір файлу не досягне вказаного обсягу.
//     Підрахунок Слів:
//     Програма повинна приймати шлях до файлу та підраховувати загальну кількість слів у ньому.
//     Результат має бути виведений у консоль.

// Програма повинна бути написана на Node.js.
//     Програма має використовувати вбудовані модулі Node.js - fs та streams.
//     Програма має підтримувати генерацію та зчитування файлів розміром до 1 гб та забезпечувати ефективне використання ресурсів системи
// Додаткове завдання (необов'язкове)
// Реалізація функціоналу для збереження статистики по частоті кожного слова у файлі.

// humanFileSize(0)          // "0 B"
// humanFileSize(1023)       // "1023 B"
// humanFileSize(1024)       // "1.00 KB"
// humanFileSize(10240)      // "10.0 KB"
// humanFileSize(102400)     // "100 KB"
// humanFileSize(1024000)    // "1000 KB"
// humanFileSize(12345678)   // "11.8 MB"
// humanFileSize(1234567890) // "1.15 GB"
