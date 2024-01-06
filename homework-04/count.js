import { createReadStream } from 'node:fs';
import { result } from './params.js';
import { validateFilePath } from './validations.js';
import { splitChunkToWords } from './utils.js';

const main = async () => {
    await validateFilePath(result, 'Result');

    const rs = createReadStream(result, 'utf8');
    let words = [];
    for await (const chunk of rs) {
        words = [...new Set([...words, ...splitChunkToWords(chunk)])];
    }
    console.log('Words count in the result file is: ', words.length);
};

main().catch(console.error);

