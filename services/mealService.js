const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAll() {
    return await prisma.meal.findMany({
        where: {
            status: {
                not: "DELETED"
            }
        }
    });
}

async function getById(id) {
    id = parseInt(id);
    const meal =  await prisma.meal.findUnique({
        where: {
            id: id,
            status: {
                not: "DELETED"
            }
        }
    });

    if(!meal){
        let error = new Error("Not Found");
        error.meta = { code: "404", error: `meal not found, id : ${id}`};
        throw error;
    }

    return meal;
}

async function create(name, photo, price) {
    price = parseFloat(price);
    return await prisma.meal.create({
        data: {
            name,
            photo,
            price
        }
    });
}

async function updateById(id, name, photo, price, status) {
    id = parseInt(id)
    price = parseFloat(price);
    
    const meal =  await prisma.meal.findUnique({
        where: {
            id: id,
            status: {
                not: "DELETED"
            }
        }
    });

    if(!meal){
        let error = new Error("Not Found");
        error.meta = { code: "404", error: `meal not found, id : ${id}`};
        throw error;
    }

    return await prisma.meal.update({
        where: {
            id
        },
        data: {
            name: name ? name : undefined,
            photo: photo ? photo : undefined,
            price: price ? price : undefined,
            status: status ? status : undefined
        }
    })
}

async function deleteById(id) {
    id = parseInt(id);

    const meal =  await prisma.meal.findUnique({
        where: {
            id: id,
            status: {
                not: "DELETED"
            }
        }
    });

    if(!meal){
        let error = new Error("Not Found");
        error.meta = { code: "404", error: `meal not found, id : ${id}`};
        throw error;
    }
    
    return await prisma.meal.update({
        where: {
            id
        },
        data: {
            status: "DELETED"
        }
    })
}

module.exports = {
    getAll,
    getById,
    create,
    updateById,
    deleteById
}