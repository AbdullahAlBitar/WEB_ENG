const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { validate } = require('../middlewares/validationMiddleware');
const { mealCreate, mealUpdate } = require('./validationSchemas');
const photoUploader = require('../middlewares/photoUploader');
const { MANAGER } = require("../middlewares/authRole");

router.get('/', mealController.index);
router.get('/:id', mealController.show);

router.post('/', MANAGER, validate(mealUpdate), photoUploader.upload.single('photo'), mealController.store);
router.patch('/:id', MANAGER, validate(mealCreate), photoUploader.upload.single('photo'), mealController.update);
router.delete('/:id', MANAGER, mealController.destroy);

module.exports = router;