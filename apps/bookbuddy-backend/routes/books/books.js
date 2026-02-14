import express from 'express';
const router = express.Router();

import verifyToken from '../../middleware/verifyToken.js';


import booksController from '../../controllers/books/booksController.js';


router.get('/search-books', booksController.searchBooks);
router.get('/books/:id', booksController.getBook);
router.post('/add-book',verifyToken ,booksController.addBookToLibrary);
router.get('/getUserBooks', verifyToken, booksController.getUserBooks);
router.put('/updateBook/:id', verifyToken, booksController.updateBook);

export default router;
