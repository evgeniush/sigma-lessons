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
            return;
        }
        res.status(200).json(book);
    } catch (e) {
        next(e);
    }
};

const addBook = async (req, res, next) => {
    try {
        const { book, location } = (await booksService.addBook(req.body)) ?? {};
        if (!book) {
            res.status(400).send(
                `Failed to add a book ${JSON.stringify(req.body)}`
            );
            return;
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
        const book = await booksService.updateBook(req.body);
        if (!book) {
            res.status(400).send(
                `Failed to update requested book ${JSON.stringify(
                    req.body
                )}. No book found.`
            );
            return;
        }
        res.status(200).json({ ...book });
    } catch (e) {
        next(e);
    }
};

const deleteBookById = async (req, res, next) => {
    try {
        const result = await booksService.deleteBookById(req.params.id);
        if (!result) {
            res.status(400).send(
                `Failed to delete requested book ${JSON.stringify(
                    req.body
                )}. No book found.`
            );
            return;
        }
        res.status(200).send(`Book with id ${req.params.id} has been deleted.`);
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
