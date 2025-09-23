import "reflect-metadata"
import express from "express";
import cors from 'cors';
import { config } from "dotenv";
import type { Request, Response } from "express";
import { AppDataSource } from "./config/db.config";
import { buildOpenAPIRouter } from "./api-docs/openAPIRouter";
import mainRouter from "./common/router/index.router";
import { errorHandler } from "./common/handler/errorHandler";
config();
const port = parseInt(process.env.PORT || '8000');
const app = express();
app.use(cors())
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
