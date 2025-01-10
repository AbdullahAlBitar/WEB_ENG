const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function login(email, password) {
    const user = await prisma.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    });

    if (!user) {
        console.log(`${email} couldn't logIn`);
        let error = new Error("Not Found");
        error.meta = { code: "404", error: 'Email not found' };
        throw error;
    }

    const fullUser = await prisma.user.findUnique({
        where: { email }
    });
    if (await bcrypt.compare(password, fullUser.password)) {
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

async function create(name, email, password, role) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data:{
            email,
            name,
            password: hashedPassword,
            role
        },
        select:{
            id: true,
            name: true,
            email: true,
            role: true
        }
    })

    return user;
}

async function createUsers() {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("1234", salt);
    let users = [];

    const Manager = await prisma.user.findUnique({
        where:{
            email: "Manager@test.com"
        }
    });

    if(!Manager){
        const newManager = await prisma.user.create({
            data:{
                name: "manager",
                email: "Manager@test.com",
                password: hashedPassword,
                role: "MANAGER"
            }
        })
        users.push(newManager)
    }else{
        users.push(Manager);
    }

    const Captain = await prisma.user.findUnique({
        where: {
            email: "Captain@test.com"
        }
    });

    if (!Captain) {
        const newCaptain = await prisma.user.create({
            data: {
                name: "captain",
                email: "Captain@test.com",
                password: hashedPassword,
                role: "CAPTAIN"
            }
        })
        users.push(newCaptain)
    } else {
        users.push(Captain);
    }
    
    return users;
}

module.exports = {
    login,
    register,
    create,
    createUsers
};