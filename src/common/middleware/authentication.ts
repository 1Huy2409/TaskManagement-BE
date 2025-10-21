import { NextFunction, Request, Response } from "express";
import { AuthFailureError } from "../handler/error.response";
import jwt from "jsonwebtoken";
import { AppDataSource } from "@/config/db.config";
import { User } from "../entities/user.entity";
export const checkAuthentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        const bearerToken = req.headers["authorization"];
        if (!bearerToken) {
            throw new AuthFailureError("You 're not authenticated!");
        }
        const token = bearerToken.split(" ")[1];
        if (!token) {
            throw new AuthFailureError("Invalid token format!");
        }
        console.log(token);
        try {
            var payload = jwt.verify(token, process.env.ACCESS_SECRET_KEY!);
            const userId = (payload as any).sub;
            const user = await userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new AuthFailureError("User not found");
            }
            req.user = user;
            next();
        } catch (err) {
            throw new AuthFailureError("Token is expired");
        }
    } catch (error) {
        next(error);
    }
}