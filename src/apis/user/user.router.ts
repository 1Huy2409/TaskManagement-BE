import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from 'express'
import multer from 'multer';
import { z } from 'zod'
import { UserResponseSchema, ListUserResponseSchema, PatchUserProfileRequest, UploadAvatarRequest } from "./schemas";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import UserController from "./user.controller";
import { checkAuthentication } from "@/common/middleware/authentication";

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
        method: 'get',
        path: '/api/v1/users/me',
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        responses: createApiResponse(UserResponseSchema, 'Success'),
    });

    router.get('/me', asyncHandler(checkAuthentication), asyncHandler(userController.getMe))

    userRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/users/profile',
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        request: {
            body: PatchUserProfileRequest
        },
        responses: createApiResponse(UserResponseSchema, 'Success')
    });

    router.patch(
        '/profile',
        asyncHandler(checkAuthentication),
        asyncHandler(userController.updateProfile)
    );

    userRegistry.registerPath({
        method: 'post',
        path: '/api/v1/users/avatar',
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        request: {
            body: UploadAvatarRequest
        },
        responses: createApiResponse(UserResponseSchema, 'Success')
    });

    router.post(
        '/avatar',
        asyncHandler(checkAuthentication),
        upload.single('avatar'),
        asyncHandler(userController.uploadAvatar)
    );

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

    userRegistry.registerPath({
        method: 'get',
        path: '/api/v1/users/me',
        tags: ['User'],
        security: [{ bearerAuth: [] }],
        responses: createApiResponse(UserResponseSchema, 'Success')
    })
    router.get('/me', asyncHandler(checkAuthentication), asyncHandler(userController.getMe))

    return router;
}
