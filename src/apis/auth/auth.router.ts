import { UserResponseSchema } from "../user/schemas";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import AuthController from "./auth.controller";
import { Router } from "express";
import express from 'express'
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import z from "zod";
import { LoginResponseSchema, PostCompleteRegister, PostLogin, PostRegister, PostRequestOTP, PostVerifyOTP, PostResetPassword, RequestOTPResponseSchema, VerifyOTPResponseSchema } from "./schemas/auth.schema";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import passport from "passport";
import { checkAuthentication } from "@/common/middleware/authentication";
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
        path: '/api/v1/auth/request-otp',
        tags: ['Auth'],
        request: { body: PostRequestOTP },
        responses: createApiResponse(RequestOTPResponseSchema, 'Success')
    })
    router.post('/request-otp', asyncHandler(authController.requestOTP))

    // Forgot password flow
    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/forgot-password/request',
        tags: ['Auth'],
        request: { body: PostRequestOTP },
        responses: createApiResponse(RequestOTPResponseSchema, 'Success')
    })
    router.post('/forgot-password/request', asyncHandler(authController.requestForgotPassword))

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/forgot-password/verify',
        tags: ['Auth'],
        request: { body: PostVerifyOTP },
        responses: createApiResponse(VerifyOTPResponseSchema, 'Success')
    })
    router.post('/forgot-password/verify', asyncHandler(authController.verifyForgotOTP))

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/forgot-password/reset',
        tags: ['Auth'],
        request: { body: PostResetPassword },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.post('/forgot-password/reset', asyncHandler(authController.resetPassword))

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/verify-otp',
        tags: ['Auth'],
        request: { body: PostVerifyOTP },
        responses: createApiResponse(VerifyOTPResponseSchema, 'Success')
    })
    router.post('/verify-otp', asyncHandler(authController.verifyOTP))

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/complete-register',
        tags: ['Auth'],
        request: { body: PostCompleteRegister },
        responses: createApiResponse(UserResponseSchema, 'Success')
    })
    router.post('/complete-register', asyncHandler(authController.completeRegister))

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/logout',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: createApiResponse(z.null(), 'Success')
    })
    router.post('/logout',
        asyncHandler(checkAuthentication),
        asyncHandler(authController.logout)
    )

    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/processNewToken',
        tags: ['Auth'],
        responses: createApiResponse(z.null(), 'Success')
    })
    router.post('/processNewToken', asyncHandler(authController.refreshToken))

    authRegistry.registerPath({
        method: 'get',
        path: '/api/v1/auth/verify',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: createApiResponse(z.object({ valid: z.boolean() }), 'Success')
    })
    router.get('/verify',
        asyncHandler(checkAuthentication),
        asyncHandler(authController.verifyToken)
    )

    return router
}