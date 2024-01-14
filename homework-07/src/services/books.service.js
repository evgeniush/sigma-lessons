import { readFile } from 'node:fs/promises';

const getFileContent = async () => {
    const data = await readFile('./books.json', { encoding: 'utf-8' });

    return JSON.parse(data);
};

const getAllBooks = async () => (await getFileContent())?.books;

const getBookById = async (bookId) => {
    const books = await getAllBooks();
    const [book] = books.filter(({ id }) => id === bookId);
    return book;
};

export default { getAllBooks, getBookById };
