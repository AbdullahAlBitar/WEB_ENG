const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll() {
    return await prisma.order.findMany();
}

async function getAllByUserId(id) {
    id = parseInt(id);
    return await prisma.order.findMany({
        where: {
            userId: id
        }
    });
}

async function getOrderById(id) {
    id = parseInt(id);
    const order = await prisma.order.findUnique({
        where: {
            id
        },
        include: {
            orderMeals: {
                select: {
                    id: true,
                    count: true,
                    meal: {
                        select: {
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
        where: {
            id,
            userId
        },
        include: {
            orderMeals: {
                select: {
                    id: true,
                    count: true,
                    meal: {
                        select: {
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
        data: {
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
        where: {
            id
        },
        data: {
            userId: userId ? userId : undefined,
            total: total ? total : undefined,
            dineIn: dineIn ? dineIn : undefined
        }
    })
}

async function deleteById(id) {
    id = parseInt(id);
    prisma.orderMeal.delete({
        where: {
            orderId: id
        }
    })
    return await prisma.order.delete({
        id
    })

}

async function addMealTo(id, mealId, userId) {
    if (id == null) {
        userId = parseInt(userId);
        const newOrder = await prisma.order.create({
            data: {
                total: 0,
                userId
            }
        });
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
        where: {
            id: mealId
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

    const orderMeal = await prisma.orderMeal.findFirst({
        where:{
            mealId,
            orderId: id
        }
    });

    let transaction = [];

    if(!orderMeal){
        transaction.push(
            prisma.orderMeal.create({
                data: {
                    orderId: id,
                    mealId,
                    count: 1
                }
            })
        );
    }else {
        transaction.push(
            prisma.orderMeal.update({
                where:{
                    id: orderMeal.id
                },
                data: {
                    count :{
                        increment: 1
                    }
                }
            })
        );
    }

    transaction.push(
        prisma.order.update({
            where : {
                id
            },
            data:{
                total :{
                    increment: meal.price
                }
            }
        })
    );

    return await prisma.$transaction(transaction);
}

async function addMealsCountTo(id, orderMeals) {
    id = parseInt(id);
    const order = await prisma.order.findUnique({
        where: {
            id
        }
    });

    if (!order) {
        let error = new Error("Not Found");
        error.meta = { code: "404", error: `Order not found, id: ${id}` };
        throw error;
    }

    let total = 0.0;
    
    await Promise.all(orderMeals.map(async om => {
        const updatedOrderMeal = await prisma.orderMeal.update({
            where: {
                id: om.id
            },
            data: {
                count: om.count
            },
            include: {
                meal: {
                    select: {
                        price: true
                    }
                }
            }
        })
        total += updatedOrderMeal.meal.price * updatedOrderMeal.count;
    }));

    const updatedOrder = await prisma.order.update({
        where: {
            id
        },
        data: {
            total: total,
            status: "PENDING"
        }
    });

    return updatedOrder;
}
module.exports = {
    getAll,
    getOrderById,
    getAllByUserId,
    getOrderByIdForUser,
    create,
    updateById,
    deleteById,
    addMealTo,
    addMealsCountTo
}