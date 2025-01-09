const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.index);
router.get('/user', orderController.showForUser);
router.get('/:id', orderController.show);
// router.put('/', orderController);
// router.delete('/:id', orderController);

module.exports = router;