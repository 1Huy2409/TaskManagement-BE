import { Request, Response } from "express";
import AuthService from "./auth.service";
import { handleServiceResponse } from "@/common/utils/httpHandler";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import { StatusCodes } from "http-status-codes";

export default class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    login = async (req: Request, res: Response) => {
        const data = {
            username: req.body.username,
            password: req.body.password
        }
        const { accessToken, refreshToken } = await this.authService.login(data)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            expires: new Date(Date.now() + 365 * 24 * 3600000)
        })
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Login successfully!',
            accessToken,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res)
    }

    // googleLogin = async (req: Request, res: Response) => {

    // }
}