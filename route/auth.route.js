const express = require('express');
const router = express.Router();

const authController = require('../controller/auth.controller');

/* Login API route which is used to perform login action */
router.post('/login', authController.login);
/* Auth API route which is used to perform authentication before every API */
router.post('/auth', authController.auth);

module.exports = router;