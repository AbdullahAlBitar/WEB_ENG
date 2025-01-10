const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secretKey = process.env.JWT_SECRET;
const maxAge = 60 * 60 * 1000;

const userService = require('../services/userService');


async function register(req, res, next) {
    try {
        const { email, password, name } = req.body;

        const newUser = await userService.register(email, name, password);

        console.log(`User Id : ${newUser.id}, Email : ${newUser.email}, registered Successfully`);

        return res.status(201).json({ "sucsses": true });

    } catch (error) {
        await next(error);
    }
}


async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        console.log(`${email} is trying to logIn`);

        const user = await userService.login(email, password);

        const token = jwt.sign({ id: user.id, role: user.role }, secretKey, { expiresIn: '1h' });
        // res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge, secure: false });

        console.log(`User Id : ${user.id}, Email : ${user.email}, logedin Successfully`);

        return res.status(200).json({jwt : token, role : user.role, user: user});

    } catch (error) {
        next(error);
    }
}

async function logout(req, res) {
    // res.cookie('jwt', '', { maxAge: 1 });
}

async function token(req, res) {
    return res.status(200).json({ stauts: "Valid" });
}

module.exports = { login, logout, register, token };


