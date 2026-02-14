import express from 'express';
const router = express.Router();

import verifyToken from '../../middleware/verifyToken.js';


import usersController from '../../controllers/users/userController.js';

router.get('/user',verifyToken, usersController.getUserById);
router.get('/user-book/:id', verifyToken, usersController.getUserBookById);
router.get('/user-notes', verifyToken, usersController.getUserNotes);
router.get('/user-note/:id', verifyToken, usersController.getUserNoteByBookId);

export default router;
