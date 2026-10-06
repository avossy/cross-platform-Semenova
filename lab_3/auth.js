import jwt from "jsonwebtoken";
import { users } from "./data.js";

const JWT_SECRET = "secret_key_for_lab_work";

export function createToken(user) {
    return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
}

export function getUserFromToken(token) {
    try {
        if (!token) return null;
        const decoded = jwt.verify(token, JWT_SECRET);
        return users.find((user) => user.id === decoded.userId) || null;
    } catch (error) {
        return null;
    }
}

export function getUserFromAuthHeader(authHeader) {
    if (!authHeader) return null;
    const token = authHeader.replace("Bearer ", "").trim();
    return getUserFromToken(token);
}