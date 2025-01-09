const express = require('express');
const router = express.Router();
const orderMealController = require('../controllers/orderMealController');

router.get('/order/:id', orderMealController.showByOrder);
router.delete('/:id', orderMealController.destroy);

module.exports = router;