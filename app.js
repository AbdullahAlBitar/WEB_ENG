const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require("express");
require('dotenv').config();

const { handleError } = require("./middlewares/errorMiddleware");
const authenticateJWT = require('./middlewares/authMiddleware');

const authRoutes = require("./routes/authRoutes")
const mealRoutes = require("./routes/mealRoutes")
const orderMealRoutes = require("./routes/orderMealRoutes")
const orderRoutes = require("./routes/orderRoutes")

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/meals", mealRoutes);
app.use("/orderMeals", orderMealRoutes);
app.use(authenticateJWT);
app.use("/orders", orderRoutes);


app.use((err, req, res, next) => {
  handleError(err, res, req);
});

startApp();

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function startApp() {
  const isConnected = await testDatabaseConnection();
  if (isConnected) {
    app.listen(port, () => {
      console.log('Server listening on port ',port);
    });
  } else {
    console.log('Server not started due to database connection failure');
    process.exit(1);
  }
}

