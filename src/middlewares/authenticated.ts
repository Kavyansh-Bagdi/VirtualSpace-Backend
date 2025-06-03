import { Request, Response, NextFunction } from "express";
import { verifytoken } from "../controllers/password";

function authentication(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Authorization header" });
    }
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!verifytoken(token)) {
        return res.status(401).json({ message: "Invalid Credential" });
    }
    next();
}

export default authentication;
