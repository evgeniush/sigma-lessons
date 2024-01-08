import { createReadStream } from 'node:fs';
import { result } from './params.js';
import { validateFilePath } from './validations.js';
import { splitChunkToWords } from './utils.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const count = async () => {
    await validateFilePath(result, 'Result');
    const rs = createReadStream(result, 'utf8');
    let words = new Set();
    console.log('Counting, be patient...');
    let start = Date.now();
    for await (const chunk of rs) {
        splitChunkToWords(chunk).forEach(word => words.add(word));
    }
    let end = Date.now();
    const spentMilliseconds = end - start;
    const formattedSpentTime = dayjs.duration(spentMilliseconds).format('HH:mm:ss');
    console.log('Words count in the result file is: ', words.size);
    console.log(`Spent time on counting: ${formattedSpentTime}`);
};

count().catch(console.error);

