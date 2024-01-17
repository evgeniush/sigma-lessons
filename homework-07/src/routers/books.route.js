import express from 'express';
import booksController from '../controllers/books.controller.js';

const router = express.Router();

router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBookById);
router.post('/', booksController.addBook);
router.post('/:id', booksController.notAllowed);
router.patch('/', booksController.notAllowed);
router.patch('/:id', booksController.updateBook);
router.delete('/', booksController.notAllowed);
router.delete('/:id', booksController.deleteBookById);

export default router;
