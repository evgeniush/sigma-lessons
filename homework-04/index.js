import { appendFile, readFile, stat } from 'node:fs/promises';
import process from 'node:process';
import stream from 'node:stream';
import sizeState from './store.js';
import { getAbortSignal, getContentEntities, getLine } from './utils.js';
import { validateRequestedFileSize, validateSentencesFilePath } from './validations.js';

async function* refreshStat(sizeState) {
    try {
        while (sizeState.isCurrentSizeLowerMax) {
            const { size } = await stat('result.txt');
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
    await appendFile('result.txt', `${line}\n`, { signal });
}

const main = async () => {
    await validateRequestedFileSize();
    await validateSentencesFilePath();

    const { sentencesFilePath, requestedFileSize } = pluckRequiredArgs();

    const signal = getAbortSignal();
    const data = await readFile(sentencesFilePath, { signal, encoding: 'utf-8' });
    const contents = getContentEntities(data);

    async function read() {
        const readable = stream.Readable.from(refreshStat(sizeState));

        readable.on('data', async () => {
            readable.pause();
            await appendResulFileWithRandomLine(contents, signal);
            readable.resume();
        });

        readable.on('end', () => {
            signal.abort();
        });
    }

    await read();
};

main().catch(console.error);


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
