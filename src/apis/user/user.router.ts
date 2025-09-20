import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from 'express'
import type { Request, Response } from 'express'
import { z } from 'zod'
import { UserSchema } from "./user.model.js";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder.js";
import UserService from "./user.service.js";
import { AppDataSource } from "@/config/db.config.js";
import { User } from "@/common/entities/user.entity.js";

export const userRegistry = new OpenAPIRegistry()
userRegistry.register('User', UserSchema);
export const userRouter: Router = (() => {
    const router = express.Router();
    const userService = new UserService(AppDataSource.getRepository(User))
    userRegistry.registerPath({
        method: 'get',
        path: '/api/users',
        tags: ['User'],
        responses: createApiResponse(z.array(UserSchema), 'Success'),
    });

    router.get('/', async (req: Request, res: Response) => {
        const serviceResponse = await userService.findAll();
        return res.status(serviceResponse.statusCode).send(serviceResponse)
    });

    userRegistry.registerPath({
        method: 'get',
        path: '/api/users/{id}',
        tags: ['User'],
        request: {
            params: z.object({
                id: z.string().openapi({ 
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'User UUID',
                    format: 'uuid'
                })
            }),
        },
        responses: createApiResponse(z.array(UserSchema), 'Success')
    })
    router.get('/:id', async (req: Request, res: Response) => {
        const id = req.params.id;
        console.log(id)
        if (id) {
            const serviceResponse = await userService.findById(id);
            res.status(serviceResponse.statusCode).send(serviceResponse)
        }
        else {
            res.status(400).json({
                success: false,
                message: 'ID is not found in param',
                responseObject: null,
                statusCode: 400
            })
        }
    })
    return router;
})();
