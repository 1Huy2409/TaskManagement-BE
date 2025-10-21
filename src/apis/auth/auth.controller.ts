import { signRefreshToken } from './../../common/utils/auth.util';
import { Request, Response } from "express";
import AuthService from "./auth.service";
import { handleServiceResponse } from "@/common/utils/httpHandler";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import { StatusCodes } from "http-status-codes";
import { User } from "@/common/entities/user.entity";
import { CompleteRegisterForm, RegisterForm, RequestOTPForm, VerifyOTPForm } from "./schemas/auth.schema";
import { AuthFailureError } from '@/common/handler/error.response';

export default class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    login = async (req: Request, res: Response) => {
        const data = {
            username: req.body.username,
            password: req.body.password
        }
        const { accessToken, refreshToken, user } = await this.authService.login(data)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            expires: new Date(Date.now() + 365 * 24 * 3600000)
        })
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Login successfully!',
            {
                accessToken: accessToken,
                user: user
            },
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res)
    }

    googleLogin = async (req: Request, res: Response) => {
        const user: User = req.user as User
        const { refreshToken } = await this.authService.googleLogin(user)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            // sameSite: "none",
            expires: new Date(Date.now() + 365 * 24 * 3600000)
        })
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Login successfully!',
            null,
            StatusCodes.OK
        )
        // return handleServiceResponse(serviceResponse, res)
        res.redirect(`${process.env.FRONTEND_BASE_URL}/TaskManagement-FE/#/oauth/success`)
    }

    requestOTP = async (req: Request, res: Response) => {
        const data: RequestOTPForm = req.body;
        const result = await this.authService.requestOTP(data);

        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            result.message,
            { email: result.email },
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }
    verifyOTP = async (req: Request, res: Response) => {
        const data: VerifyOTPForm = req.body;
        const result = await this.authService.verifyOTP(data);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            result.message,
            { email: result.email },
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }
    completeRegister = async (req: Request, res: Response) => {
        const data: CompleteRegisterForm = req.body;
        const newUser = await this.authService.completeRegister(data);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Register completed successfully!',
            newUser,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    refreshToken = async (req: Request, res: Response) => {
        const { newAccessToken, newRefreshToken } = await this.authService.refreshToken(req)
        res.clearCookie('refreshToken')
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: false,
            // sameSite: "none",
            expires: new Date(Date.now() + 365 * 24 * 3600000)
        })
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Refresh token successfully!',
            {
                accessToken: newAccessToken
            },
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res)
    }

    logout = async (req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            throw new AuthFailureError(`Refresh token is not found!`)
        }
        res.clearCookie('refreshToken')
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Logout successfully!',
            null,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res)
    }
}