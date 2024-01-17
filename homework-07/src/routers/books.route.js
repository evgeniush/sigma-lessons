import express from 'express';
import booksController from '../controllers/books.controller.js';

const router = express.Router();

router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBookById);
router.post('/', booksController.addBook);

export default router;
