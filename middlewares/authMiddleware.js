const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.headers.jwt; 

    // if (!token) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        console.log(`${decoded.role}, ID: ${decoded.id}, is authorized`);
        
    } catch (error) {
        //return res.status(403).json({ error: 'Invalid token' });
        console.log("not logged in");
        
    } finally {
        next();
    }
};

module.exports = authenticateJWT;
