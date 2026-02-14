import express from 'express';
const router = express.Router();

import authController from '../../controllers/auth/auth.js';

router.post('/login', authController.login)
router.post('/signup', authController.createUser);

export default router;
