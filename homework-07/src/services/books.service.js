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
    const data = await readFile('./books.json', { encoding: 'utf-8' });
    const { books } = JSON.parse(data);
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

export default { getAllBooks, getBookById, addBook };
