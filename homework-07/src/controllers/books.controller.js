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

export default { getBooks, getBookById };
