const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll() {
    return await prisma.order.findMany();
}

async function getAllByUserId(id) {
    id = parseInt(id);
    return await prisma.order.findMany({
        where:{
            userId : id
        }
    });
}

async function getOrderById(id) {
    id = parseInt(id);
    const order = await prisma.order.findUnique({
        where:{
            id
        },
        include: {
            orderMeals : {
                select: {
                    id: true,
                    count: true,
                    meal: {
                        select:{
                            id: true,
                            name: true,
                            price: true,
                            photo: true
                        }
                    }
                }
            }
        }
    });

    if (!order) {
        let error = new Error("Not Found");
        error.meta = { code: "404", error: `Order not found, id: ${id}` };
        throw error;
    }

    return order;
}

async function getOrderByIdForUser(id, userId) {
    id = parseInt(id);
    userId = parseInt(userId);
    return await prisma.order.findUnique({
        where:{
            id,
            userId
        },
        include: {
            orderMeals : {
                select: {
                    id: true,
                    count: true,
                    meal: {
                        select:{
                            id: true,
                            name: true,
                            price: true,
                            photo: true
                        }
                    }
                }
            }
        }
    });
}

async function create(userId) {
    userId = parseInt(userId);
    return await prisma.order.create({
        data:{
            userId,
            total: 0,
        }
    });
}

async function updateById(id, userId, total, dineIn) {
    id = parseInt(id);
    userId = parseInt(userId);
    total = parseFloat(total);

    return await prisma.order.update({
        where:{
            id
        },
        data:{
            userId: userId? userId : undefined,
            total: total? total : undefined,
            dineIn: dineIn? dineIn : undefined
        }
    })
}

async function deleteById(id) {
    id = parseInt(id);
    prisma.orderMeal.delete({
        where:{
            orderId: id
        }
    })
    return await prisma.order.delete({
        id
    })
    
}

async function addMealTo(id, mealId) {
    if(id == null){
        const newOrder = await prisma.order.create();
        id = newOrder.id;
    }
    id = parseInt(id);
    mealId = parseInt(mealId);

    const order = await prisma.order.findUnique({
        where: {
            id,
        },
    });

    const meal = await prisma.meal.findUnique({
        where : {
            mealId
        }
    })

    if (!order) {
        let error = new Error("Not Found");
        error.meta = { code: "404", error: `Order not found, id: ${id}` };
        throw error;
    }

    if (!meal) {
        let error = new Error("Not Found");
        error.meta = { code: "404", error: `Meal not found, id: ${mealId}` };
        throw error;
    }

    const newOrderWithMeal = await prisma.$transaction(async (tx) => {
        const newOrderMeal = await tx.orderMeal.create({
            data: {
                orderId: id,
                mealId
            }
        });
    
        const updatedOrder = await tx.order.update({
            where: {
                id,
            },
            data: {
                total: {
                    increment: meal.price
                },
            },
        });
    
        return newOrderWithMeal != null;
    });
    

    return null;
}

async function addMealsCountTo(id, meals) {
    id = parseInt(id);
    const order = await prisma.order.findUnique({
        where: {
            id
        }
    })
}

module.exports = {
    getAll,
    getOrderById,
    getAllByUserId,
    getOrderByIdForUser,
    create,
    updateById,
    deleteById,
    addMealTo
}