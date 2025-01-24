const express = require('express');
const router = express.Router();

const authController = require('../../controllers/auth/auth');

router.post('/login', authController.login)
router.post('/signup', authController.createUser);

module.exports = router;