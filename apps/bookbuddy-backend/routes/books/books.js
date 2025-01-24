const express = require('express');
const router = express.Router();

const verifyToken = require('../../middleware/verifyToken');


const booksController = require('../../controllers/books/booksController');


router.get('/search-books', booksController.searchBooks);
router.get('/books/:id', booksController.getBook);
router.post('/add-book',verifyToken ,booksController.addBookToLibrary);
router.get('/getUserBooks', verifyToken, booksController.getUserBooks);
router.put('/updateBook/:id', verifyToken, booksController.updateBook);

module.exports = router;

