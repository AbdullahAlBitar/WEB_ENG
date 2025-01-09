const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
    // Delete all existing data
    console.log("Deleting old data...");
    await prisma.orderMeal.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.meal.deleteMany({});
    await prisma.user.deleteMany({});
    console.log("Old data deleted!");

    // Seed meals
    console.log("Seeding Meals...");
    const meals = [
        { name: "Margherita Pizza", price: 15.99, photo: "margherita.jpg" },
        { name: "Veggie Burger", price: 10.99, photo: "veggie_burger.jpg" },
        { name: "Caesar Salad", price: 8.49, photo: "caesar_salad.jpg" },
        { name: "Spaghetti Bolognese", price: 12.49, photo: "spaghetti_bolognese.jpg" },
        { name: "Grilled Chicken", price: 14.99, photo: "grilled_chicken.jpg" },
    ];

    const mealPromises = meals.map((meal) =>
        prisma.meal.create({
            data: meal,
        })
    );
    const createdMeals = await Promise.all(mealPromises);

    // Seed users
    console.log("Seeding Users...");
    const users = [
        {
            email: "customer1@example.com",
            name: "name",
            password: await bcrypt.hash("password123", 10),
            role: "CUSTOMER",
        },
        {
            email: "captain1@example.com",
            name: "name",
            password: await bcrypt.hash("password123", 10),
            role: "CAPTAIN",
        },
        {
            email: "manager1@example.com",
            name: "name",
            password: await bcrypt.hash("password123", 10),
            role: "MANAGER",
        },
    ];

    const userPromises = users.map((user) =>
        prisma.user.create({
            data: user,
        })
    );
    const createdUsers = await Promise.all(userPromises);

    // Seed orders
    console.log("Seeding Orders...");
    const orders = [
        { userId: createdUsers[0].id, total: 0.0, status: "PENDING" },
        { userId: createdUsers[0].id, total: 0.0, status: "PENDING" },
    ];

    const orderPromises = orders.map((order) =>
        prisma.order.create({
            data: order,
        })
    );
    const createdOrders = await Promise.all(orderPromises);

    // Seed order meals
    console.log("Seeding Order Meals...");
    const orderMeals = [
        { orderId: createdOrders[0].id, mealId: createdMeals[0].id, count: 2 }, // 2 Margherita Pizzas
        { orderId: createdOrders[0].id, mealId: createdMeals[1].id, count: 1 }, // 1 Veggie Burger
        { orderId: createdOrders[1].id, mealId: createdMeals[2].id, count: 3 }, // 3 Caesar Salads
    ];

    const orderMealPromises = orderMeals.map((orderMeal) =>
        prisma.orderMeal.create({
            data: orderMeal,
        })
    );
    await Promise.all(orderMealPromises);

    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
