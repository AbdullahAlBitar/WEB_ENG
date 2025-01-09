const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateJWT = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const { signInSchema, signUpSchema } = require('./validationSchemas');

router.post('/login', validate(signInSchema), authController.login);
router.post('/register', validate(signUpSchema), authController.register);

router.get('/token', authenticateJWT, authController.token);
router.get('/logout', authController.logout);

module.exports = router;