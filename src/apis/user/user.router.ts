import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from 'express'
import { z } from 'zod'
import { UserResponseSchema, ListUserResponseSchema } from "./schemas";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import UserController from "./user.controller";

export const userRegistry = new OpenAPIRegistry()
userRegistry.register('User', UserResponseSchema);
export default function userRouter(userController: UserController): Router {
    const router: Router = express.Router();
    userRegistry.registerPath({
        method: 'get',
        path: '/api/v1/users',
        tags: ['User'],
        responses: createApiResponse(ListUserResponseSchema, 'Success'),
    });

    router.get('/', asyncHandler(userController.findAll));

    userRegistry.registerPath({
        method: 'get',
        path: '/api/v1/users/{id}',
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
        responses: createApiResponse(UserResponseSchema, 'Success')
    })
    router.get('/:id', asyncHandler(userController.findByID))

    return router;
}
