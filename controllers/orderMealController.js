const orderMealService = require("../services/orderMealService");

async function showByOrder(req, res, next) {
    try {
        const id = req.params.id;

        const orderMeal = await orderMealService.getById(id);

        return res.status(200).json({orderMeal});
        
    } catch (error) {
        next(next);
    }
}

async function destroy(req, res, next) {
    try {
        const id = req.params.id;

        const deletedOrderMeal = await orderMealService.deleteById(id);

        return res.status(200).json({deletedOrderMeal});
        
    } catch (error) {
        next(error);
    }
}

module.exports = {
    showByOrder,
    destroy
}