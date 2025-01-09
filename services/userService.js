const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function login(email, password) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        console.log(`${email} couldn't logIn`);
        let error = new Error("Not Found");
        error.meta = { code: "404", error: 'Email not found' };
        throw error;
    }

    if (await bcrypt.compare(password, user.password)) {
        return user;
    } else {
        console.log(`${email} couldn't log in`);
        let error = new Error("Authentication Failed");
        error.meta = { code: "401", error: "Invalid credentials" };
        throw error;
    }
}

async function register(email, name, password) {
    // const user = await prisma.user.findUnique({
    //     where: {
    //         email
    //     }
    // });

    // if (user) {
    //     console.log(`${email} already has an account`);
    //     let error = new Error("Account already exists");
    //     error.meta = { code: "409", error: "Email is already registered" };
    //     throw error;
    // }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return await prisma.user.create({
        data: {
            email,
            name,
            password: hashedPassword
        }
    });
}

module.exports = {
    login,
    register
};