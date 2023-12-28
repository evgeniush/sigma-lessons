import process from 'node:process';
import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { RESULT_FILE_NAME } from './constants.js';
import path from 'node:path';
import { countChunkWords } from './utils.js';

function pluckResultFilePath() {
    const [, , resultFileFolder] = process.argv;
    return { resultFileFolder };
}

const main = async () => {
    const { resultFileFolder } = pluckResultFilePath();
    const resultFilePath = path.resolve(resultFileFolder, RESULT_FILE_NAME);
    await access(resultFilePath);
    const rs = createReadStream(resultFilePath, 'utf8');
    let count = 0;
    for await (const chunk of rs) {
        count = count + countChunkWords(chunk);
    }
    console.log('Words count in the result file is: ', count);
};

main().catch(console.error);

