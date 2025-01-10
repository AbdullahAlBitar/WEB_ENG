const express = require('express');
const router = express.Router();
const orderMealController = require('../controllers/orderMealController');
const { MANAGER } = require('../middlewares/authRole');

router.get('/order/:id', orderMealController.showByOrder);
router.delete('/:id', MANAGER, orderMealController.destroy);

module.exports = router;