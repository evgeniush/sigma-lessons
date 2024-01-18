import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';

const getFileContent = async () => {
    const data = await readFile('./books.json', { encoding: 'utf-8' });

    return JSON.parse(data);
};

const getAllBooks = async () => (await getFileContent())?.books ?? [];

const getBookById = async (bookId) => {
    const books = await getAllBooks();
    const [book] = books.filter(({ id }) => id === bookId);
    return book;
};

const addBook = async ({ title, author } = {}) => {
    if ([title, author].some((v) => !Boolean(v))) {
        return null;
    }
    const books = await getAllBooks();
    const id = randomUUID();
    const book = {
        title,
        author,
        id,
    };
    await writeFile(
        './books.json',
        JSON.stringify({
            books: [...books, book],
        }),
        {
            encoding: 'utf-8',
        }
    );
    return {
        book,
        location: `/books/${id}`,
    };
};

const updateBook = async (book) => {
    const books = await getAllBooks();
    const [bookToUpdate] = [...books.filter(({ id }) => id === book.id)];
    if (!bookToUpdate) {
        return null;
    }
    await writeFile(
        './books.json',
        JSON.stringify({
            books: [...books.filter(({ id }) => id !== book.id), book],
        }),
        {
            encoding: 'utf-8',
        }
    );
    return book;
};

const deleteBookById = async (bookId) => {
    const books = await getAllBooks();
    const [bookToDelete] = [...books.filter(({ id }) => id === bookId)];
    if (!bookToDelete) {
        return false;
    }
    await writeFile(
        './books.json',
        JSON.stringify({
            books: [...books.filter(({ id }) => id !== bookId)],
        }),
        {
            encoding: 'utf-8',
        }
    );
    return true;
};

export default {
    getAllBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBookById,
};
