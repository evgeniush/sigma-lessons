import { createReadStream } from 'node:fs';
import { result } from './params.js';
import { validateFilePath } from './validations.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';

dayjs.extend(duration);

const count = async () => {
    await validateFilePath(result, 'Result');
    const rs = createReadStream(result, 'utf8');
    let wordsCount = 0;
    console.log('Counting, be patient...');
    let start = Date.now();
    let paragraph = '';
    for await (const chunk of rs) {
        paragraph = `${paragraph}${chunk}`;
        const lines = paragraph.split('\n');
        const items = lines.flatMap((line) => line.split(' '));
        const last = paragraph.endsWith('\n') ? '' : items.pop();
        wordsCount = wordsCount + items.length;
        paragraph = last;
    }
    let end = Date.now();
    const spentMilliseconds = end - start;
    const formattedSpentTime = dayjs
        .duration(spentMilliseconds)
        .format('HH:mm:ss');
    console.log('Words count in the result file is: ', wordsCount);
    console.log(`Spent time on counting: ${formattedSpentTime}`);
};

count().catch(console.error);
