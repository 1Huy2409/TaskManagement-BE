import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import AuthController from "./auth.controller";
import { Router } from "express";
import express from 'express'
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import z from "zod";
import { LoginResponseSchema, PostLogin } from "./schema/auth.schema";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import passport from "passport";
export const authRegistry = new OpenAPIRegistry()
export default function authRouter(authController: AuthController): Router {
    const router: Router = express.Router()
    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/login',
        tags: ['Auth'],
        request: { body: PostLogin },
        responses: createApiResponse(LoginResponseSchema, 'Success')
    })
    router.post('/login', asyncHandler(authController.login))

    router.get('/google',
        passport.authenticate('google', {
            scope: ["email", "profile"],
            session: false
        })
    )

    router.get('/google/callback',
        passport.authenticate('google',
            { failureRedirect: '/login', session: false },
        ),
        asyncHandler(authController.googleLogin)
    )
    return router
}