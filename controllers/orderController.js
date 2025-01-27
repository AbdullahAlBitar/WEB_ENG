const orderService = require('../services/orderService');

async function index(req, res) {
    const orders = await orderService.getAll();

    return res.status(200).json({ orders });
}

async function show(req, res, next) {
    try {
        const id = req.params.id;

        const order = await orderService.getOrderById(id);

        return res.status(200).json({ order });

    } catch (error) {
        next(error);
    }
}

async function showForUser(req, res, next) {
    try {
        const id = req.user.id;

        const orders = await orderService.getAllByUserId(id);

        return res.status(200).json({ orders });
    } catch (error) {
        next(error);
    }
}

async function addMeal(req, res, next) {
    try {
        const id = req.params.id || null;
        const userId = req.user.id;
        const { mealId } = req.body;

        const newOrder = await orderService.addMealTo(id, mealId, userId);

        return res.status(200).json({ order : newOrder[1] });

    } catch (error) {
        next(error);
    }
}

async function confirmOrder(req, res, next) {
    try {
        const id = req.params.id;
        const { orderMeals } = req.body;

        const order = await orderService.addMealsCountTo(id, orderMeals);

        return res.status(200).json({ order });

    } catch (error) {
        next(error);
    }
}

async function update(req, res, next) {
    try {
        const id = req.params.id;
        const { status, dineIn, notes} = req.body;

        const order = await orderService.updateById(id, status, dineIn, notes);

        return res.status(200).json({order});
    } catch (error) {
        
    }
}

module.exports = {
    index,
    show,
    showForUser,
    addMeal,
    confirmOrder,
    update
}