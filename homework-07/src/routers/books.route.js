import express from 'express';
import booksController from '../controllers/books.controller.js';

const router = express.Router();

router.get('/', booksController.getBooks);
router.get('/:id', booksController.getBookById);

export default router;
