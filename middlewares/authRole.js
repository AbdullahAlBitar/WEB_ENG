const MANAGER = (req, res, next) => {
    if(req.user.role === "MANAGER"){
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized only MANAGER' });
    }
}

const CAPTAIN = (req, res, next) => {
    if(req.user.role === "CAPTAIN"){
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized only CAPTAIN' });
    }
}

module.exports = {MANAGER, CAPTAIN};