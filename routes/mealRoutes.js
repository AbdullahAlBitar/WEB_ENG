const express = require('express');
const router = express.Router();
const mealController = require('../controllers/mealController');
const { validate } = require('../middlewares/validationMiddleware');
const { mealCreate, mealUpdate } = require('./validationSchemas');
const photoUploader = require('../middlewares/photoUploader');

router.get('/', mealController.index);
router.get('/:id', mealController.show);

router.post('/', validate(mealUpdate), photoUploader.upload.single('photo'), mealController.store);
router.patch('/:id', validate(mealCreate), photoUploader.upload.single('photo'), mealController.update);
router.delete('/:id', mealController.destroy);

module.exports = router;