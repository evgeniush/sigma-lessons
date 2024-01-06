export const sample = arr => arr[Math.floor(Math.random() * arr.length)];

export const getLine = ({ ids = [], entities = new Map() }) => {
    const randomIndex = sample(ids);
    return entities.get(randomIndex);
};

export const getRawContentEntities = (data = '') => {
    const contents = {
        ids: [],
        entities: new Map(),
    };
    contents.ids = data.split('\n').filter(Boolean).map((sentence, i) => {
        contents.entities.set(i, sentence);
        return i;
    });
    return contents;
};

export const splitChunkToWords = (chunk) => chunk.split('\n').reduce((acc, cur) => [
    ...acc, ...cur.split(' '),
], []);

export const byteSize = str => new Blob([str]).size;
