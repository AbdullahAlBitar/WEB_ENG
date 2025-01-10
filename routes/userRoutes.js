const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validate } = require('../middlewares/validationMiddleware');
const { signUpSchema } = require('./validationSchemas');
const { MANAGER } = require("../middlewares/authRole");

router.post('/', MANAGER, validate(signUpSchema), userController.create);

module.exports = router;