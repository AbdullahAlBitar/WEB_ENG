const userService = require('../services/userService');


async function create(req, res, next) {
    try {
        const {name, email, password, role} = req.body;

        const user = await userService.create(name, email, password, role);

        return res.status(200).json({user})
    } catch (error) {
        next(error);
    }
}

module.exports ={
    create
}