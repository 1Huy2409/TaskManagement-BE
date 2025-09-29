import "reflect-metadata"
import express from "express";
import cors from 'cors';
import { config } from "dotenv";
import type { Request, Response } from "express";
import { AppDataSource } from "./config/db.config";
import { buildOpenAPIRouter } from "./api-docs/openAPIRouter";
import mainRouter from "./common/router/index.router";
import { errorHandler } from "./common/handler/errorHandler";
import passport from "passport";
import session from "express-session";
import "./apis/auth/strategy/google.strategy";
import "./apis/auth/strategy/jwt.strategy";
import cookieParser from "cookie-parser";
config();
const port = parseInt(process.env.PORT || '8000');
const app = express();
app.use(cors())
app.use(cookieParser())
app.use(express.json())
// app.use(session({
//     secret: process.env.SESSION_SECRET!
// }))
app.use(passport.initialize())
// app.use(passport.session())
app.get('/', (req: Request, res: Response) => {
    res.send('Hello Nguyen Huu Nhat Huy')
})
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!")
        app.use('/api/v1', mainRouter)
        app.use('/api-docs', buildOpenAPIRouter())
        app.use(errorHandler);
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on http://0.0.0.0:${port}`);
            console.log(`Access via http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Database connection error: ", error)
    })
