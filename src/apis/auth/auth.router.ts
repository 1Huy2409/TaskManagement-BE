import { UserResponseSchema } from "../user/schemas";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import AuthController from "./auth.controller";
import { Router } from "express";
import express from 'express'
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import z from "zod";
import { LoginResponseSchema, PostCompleteRegister, PostLogin, PostRegister, PostRequestOTP, PostVerifyOTP, PostResetPassword, PostResetPasswordHaveLoggedIn, RequestOTPResponseSchema, VerifyOTPResponseSchema, ResetPasswordResponseSchema } from "./schemas/auth.schema";
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
        path: '/api/v1/auth/register',
        tags: ['Auth'],
        request: { body: PostRegister },
        responses: createApiResponse(RequestOTPResponseSchema, 'Success')
    })
    router.post('/register', asyncHandler(authController.requestOTP))
    
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
        responses: createApiResponse(ResetPasswordResponseSchema, 'Success')
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
    authRegistry.registerPath({
        method: 'post',
        path: '/api/v1/auth/reset',
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        request: { body: PostResetPasswordHaveLoggedIn },
        responses: createApiResponse(ResetPasswordResponseSchema, 'Success')
    })
    router.get('/verify',
        asyncHandler(checkAuthentication),
        asyncHandler(authController.verifyToken)
    )
    router.post('/reset', asyncHandler(checkAuthentication), asyncHandler(authController.resetPasswordHaveLoggedIn))
    return router
}
