// middleware that verifies the token and sets the user ID in the request object:

import jwt from 'jsonwebtoken';
import 'dotenv/config';

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    const token = authHeader.split(' ')[1];


    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }
        req.UserId = decoded.UserId;
        next();
    });
};

export default verifyToken;
