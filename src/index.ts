import "reflect-metadata"
import express from "express";
import cors from 'cors';
import { config } from "dotenv";
import type { Request, Response } from "express";
import { AppDataSource } from "./config/db.config.js";
import { openAPIRouter } from "./api-docs/openAPIRouter.js";
import { userRouter } from "./apis/user/user.router.js";
config();
const port = parseInt(process.env.PORT || '8000');
const app = express();
app.use(cors())
app.use('/api-docs', openAPIRouter)
app.use('/api/users', userRouter)
app.get('/', (req: Request, res: Response) => {
    res.send('Hello Nguyen Huu Nhat Huy')
})
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!")
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on http://0.0.0.0:${port}`);
            console.log(`Access via http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Database connection error: ", error)
    })
