import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

const verifyToken = (req, res, next) => {
    const authHeader= req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: "No bearer token provided" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.Email = decoded.Email;
        next();
    });
};

export default verifyToken;



