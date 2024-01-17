import { readFile, writeFile } from 'node:fs/promises';

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

const addBook = async (book) => {
    const books = await getAllBooks();
    await writeFile(
        './books.json',
        JSON.stringify({
            books: [...books, book],
        }),
        {
            encoding: 'utf-8',
        }
    );
    return book.id;
};

const updateBook = async (book) => {
    const books = await getAllBooks();
    await writeFile(
        './books.json',
        JSON.stringify({
            books: [...books.filter(({ id }) => id !== book.id), book],
        }),
        {
            encoding: 'utf-8',
        }
    );
    return book.id;
};

const deleteBookById = async (bookId) => {
    const books = await getAllBooks();
    await writeFile(
        './books.json',
        JSON.stringify({
            books: [...books.filter(({ id }) => id !== bookId)],
        }),
        {
            encoding: 'utf-8',
        }
    );
    return bookId;
};

export default {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBookById,
};
