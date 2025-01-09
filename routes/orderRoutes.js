const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validate } = require('../middlewares/validationMiddleware');
const { addMealToOrder, addOrderMealsCount } = require('./validationSchemas');

router.get('/', orderController.index);
router.get('/user', orderController.showForUser);
router.get('/:id', orderController.show);

router.post('/', validate(addMealToOrder), orderController.addMeal);
router.post('/:id', validate(addMealToOrder), orderController.addMeal);

router.post('/confirm/:id', validate(addOrderMealsCount), orderController.confirmOrder);

// router.put('/', orderController);
// router.delete('/:id', orderController);

module.exports = router;