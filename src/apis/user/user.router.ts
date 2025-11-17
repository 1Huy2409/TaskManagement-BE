import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from 'express'
import multer from 'multer';
import { z } from 'zod'
import { UserResponseSchema, ListUserResponseSchema, PatchUserProfileRequest, UploadAvatarRequest } from "./schemas";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import UserController from "./user.controller";

export const userRegistry = new OpenAPIRegistry()
userRegistry.register('User', UserResponseSchema);
export default function userRouter(userController: UserController): Router {
    const router: Router = express.Router();
    const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });
    userRegistry.registerPath({
        method: 'get',
        path: '/api/v1/users',
        tags: ['User'],
        responses: createApiResponse(ListUserResponseSchema, 'Success'),
    });

    router.get('/', asyncHandler(userController.findAll));

    userRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/users/{id}/profile',
        tags: ['User'],
        request: {
            params: z.object({
                id: z.string().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'User UUID',
                    format: 'uuid'
                })
            }),
            body: PatchUserProfileRequest
        },
        responses: createApiResponse(UserResponseSchema, 'Success')
    });

    router.patch('/:id/profile', asyncHandler(userController.updateProfile));

    userRegistry.registerPath({
        method: 'post',
        path: '/api/v1/users/{id}/avatar',
        tags: ['User'],
        request: {
            params: z.object({
                id: z.string().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'User UUID',
                    format: 'uuid'
                })
            }),
            body: UploadAvatarRequest
        },
        responses: createApiResponse(UserResponseSchema, 'Success')
    });

    router.post('/:id/avatar', upload.single('avatar'), asyncHandler(userController.uploadAvatar));

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
