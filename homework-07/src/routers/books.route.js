import express from 'express';
import booksController from '../controllers/books.controller.js';

const router = express.Router();

router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBookById);
router.post('/', booksController.addBook);
router.post('/:id', booksController.notAllowed);
router.patch('/', booksController.notAllowed);
router.post('/:id', booksController.updateBook);
router.delete('/', booksController.notAllowed);

export default router;
