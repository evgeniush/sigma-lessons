import express from 'express';
import booksRouter from './routers/books.route.js';
import errorHandler from './middlewares/error-handler.middleware.js';

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use('/books', booksRouter);

app.use('/', (req, res) => {
    res.send('Hello world!');
});

app.use(errorHandler);

export default app;
