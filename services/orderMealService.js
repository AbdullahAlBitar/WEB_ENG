const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getById(id) {
    id = parseInt(id);
    const orderMeal = await prisma.orderMeal.findUnique({
        where: {
            id
        }
    });

    if(!orderMeal){
        let error = new Error("Not Found");
        error.meta = { code: "404", error: `orderMeal not found, id : ${id}`};
        throw error;
    }
    return orderMeal;
}

async function getByOrderId(orderId) {
    orderId = parseInt(orderId);
    const orderMeals = await prisma.orderMeal.findMany({
        where: {
            orderId
        }
    });

    if(!orderMeals){
        let error = new Error("Not Found");
        error.meta = { code: "404", error: `orderMeals not found, orderId : ${id}`};
        throw error;
    }
    return orderMeals;
}

// async function updateById(id, orderId, mealId, count, notes) {
//     id = parseInt(id);
//     orderId = parseInt(orderId);
//     mealId = parseInt(mealId);
//     count = parseInt(count);
//     const orderMeal = await prisma.orderMeal.findUnique({
//         where:{
//             id
//         },
//         include: {
//             meal: {
//                 select:{
//                     price : true
//                 }
//             }
//         }
//     })

//     const updatedOrderMeal = await prisma.orderMeal.update({
//         where: {
//             id
//         },
//         data: {
//             orderId: orderId ? orderId : undefined,
//             mealId: mealId ? mealId : undefined,
//             count: count ? count : undefined,
//             notes: notes ? notes : undefined
//         },
//         include:{
//             meal :{
//                 select: {
//                     price : true
//                 }
//             },
//             order: {
//                 select :{
//                     status : true
//                 }
//             }
//         }

//     });
//     if(updatedOrderMeal.order.status === "TEMP"){
//         await prisma.order.update({
//             where:{
//                 id : updatedOrderMeal.orderId
//             },
//             data:{
//                 total: {
//                     increment : (orderMeal.meal.price - updatedOrderMeal.meal.price)
//                 }
//             }
//         })
//     }
// }

async function deleteById(id) {
    id = parseInt(id);
    return await prisma.orderMeal.delete({
        where: {
            id
        }
    });
}

// async function create(orderId, mealId, notes) {
//     orderId = parseInt(orderId);
//     mealId = parseInt(mealId);
    
//     const orderMeal = await prisma.orderMeal.create({
//         data: {
//             orderId,
//             mealId,
//             notes
//         },
//         include :{
//             meal:{
//                 select: {
//                     price : true
//                 }
//             }
//         }
//     });

//     await prisma.order.update({
//         where: {
//             id: orderId
//         },
//         data: {
//             total: {
//                 increment : orderMeal.meal.
//             }
//         }
//     });

//     return orderMeal;
// }


module.exports = {
    getById,
    getByOrderId,
    deleteById
}
