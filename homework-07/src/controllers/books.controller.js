import booksService from '../services/books.service.js';

const getBooks = async (req, res, next) => {
    try {
        const books = await booksService.getAllBooks();
        res.status(200).json({
            books,
            booksCount: books.length,
        });
    } catch (e) {
        next(e);
    }
};

const getBookById = async (req, res, next) => {
    try {
        const book = await booksService.getBookById(req.params.id);
        if (!book) {
            res.sendStatus(404);
        }
        res.status(200).json(book);
    } catch (e) {
        next(e);
    }
};

const addBook = async (req, res, next) => {
    try {
        const { book, location } = await booksService.addBook(req.body);
        if (!book) {
            throw new Error(`Failed to add a book ${JSON.stringify(req.body)}`);
        }
        res.status(200)
            .set({
                Location: location,
            })
            .json(book);
    } catch (e) {
        next(e);
    }
};

const notAllowed = async (req, res) => {
    res.status(405).send('Sorry, not allowed');
};

const updateBook = async (req, res, next) => {
    try {
        const id = await booksService.updateBook(req.body);
        if (!id) {
            throw new Error(
                `Failed to update a book ${JSON.stringify(req.body)}`
            );
        }
        res.status(200).json({ id });
    } catch (e) {
        next(e);
    }
};

const deleteBookById = async (req, res, next) => {
    try {
        await booksService.deleteBookById(req.params.id);
        res.status(200).json(req.params.id);
    } catch (e) {
        next(e);
    }
};

export default {
    getBooks,
    getBookById,
    addBook,
    notAllowed,
    updateBook,
    deleteBookById,
};
