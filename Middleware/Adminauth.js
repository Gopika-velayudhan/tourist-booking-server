import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config()

const verifytoken1 = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: "No bearer token provided" });
    }

    const token = authHeader.split(' ')[1];
    
    jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRT, (err, decoded) => {
    
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.email = decoded.email;
        next();
    });
    
};

export default verifytoken1;
