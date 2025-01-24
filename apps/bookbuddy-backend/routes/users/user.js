const express = require('express');
const router = express.Router();

const verifyToken = require('../../middleware/verifyToken');


const usersController = require('../../controllers/users/userController');

router.get('/user',verifyToken, usersController.getUserById);
router.get('/user-book/:id', verifyToken, usersController.getUserBookById);
router.get('/user-notes', verifyToken, usersController.getUserNotes);
router.get('/user-note/:id', verifyToken, usersController.getUserNoteByBookId);

module.exports = router;