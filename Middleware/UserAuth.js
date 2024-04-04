import { Jwt } from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.USER_ACCESS_TOKEN_SECRT, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        req.Email = decoded.Email;
        next();
    });
};
export default verifyToken