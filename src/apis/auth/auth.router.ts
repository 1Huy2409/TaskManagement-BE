import { UserResponseSchema } from "../user/schemas";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import AuthController from "./auth.controller";
import { Router } from "express";
import express from 'express'
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import z from "zod";
import { LoginResponseSchema, PostLogin, PostRegister } from "./schemas/auth.schema";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import passport from "passport";
export const authRegistry = new OpenAPIRegistry()
export default function authRouter(authController: AuthController): Router {
    const router: Router = express.Router()
    authRegistry.registerComponent('securitySchemes', 'bearerAuth', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
    });

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/login',
        tags: ['Auth'],
        request: { body: PostLogin },
        responses: createApiResponse(LoginResponseSchema, 'Success')
    })
    router.post('/login', asyncHandler(authController.login))

    // google oauth
    router.get('/google',
        passport.authenticate('google', {
            scope: ["email", "profile"],
            session: false
        })
    ) // ==> http://localhost:2409/api/v1/auth/google/callback?code=...
    router.get('/google/callback',
        passport.authenticate('google',
            { failureRedirect: '/login', session: false },
        ), // exchange authorization code for access token
        asyncHandler(authController.googleLogin)
    )
    // end google oauth

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/register',
        tags: ['Auth'],
        request: { body: PostRegister },
        responses: createApiResponse(UserResponseSchema, 'Success')
    })
    router.post('/register', asyncHandler(authController.register))

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/logout',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: createApiResponse(z.null(), 'Success')
    })
    router.post('/logout',
        passport.authenticate('jwt', { session: false }),
        asyncHandler(authController.logout)
    )

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/processNewToken',
        tags: ['Auth'],
        responses: createApiResponse(z.null(), 'Success')
    })
    router.post('/processNewToken', asyncHandler(authController.refreshToken))
    return router
}