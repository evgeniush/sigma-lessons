export const sample = arr => arr[Math.floor(Math.random() * arr.length)];

export const getLine = ({ ids = [], entities = new Map() }) => {
    const randomIndex = sample(ids);
    return entities.get(randomIndex);
};

export const getContentEntities = (data = []) => {
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

export const getAbortSignal = () => {
    const controller = new AbortController();
    const { signal } = controller;
    return signal;
};
