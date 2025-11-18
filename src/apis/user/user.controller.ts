import UserService from "./user.service";
import type { Express, Request, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandler";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import { StatusCodes } from "http-status-codes";
import { AuthFailureError, BadRequestError } from "@/common/handler/error.response";
import { PatchUserProfileRequest } from "./schemas";
import { verifyAccessToken } from "@/common/utils/auth.util";

export default class UserController {
    constructor(
        private userService: UserService
    ) {
    }

    private getUserIdFromAuth = (req: Request): string => {
        if (req.user?.id) {
            return req.user.id;
        }
        const bearerToken = req.headers["authorization"];
        if (!bearerToken) {
            throw new AuthFailureError("You 're not authenticated!");
        }
        const token = bearerToken.split(" ")[1];
        if (!token) {
            throw new AuthFailureError("Invalid token format!");
        }
        const payload = verifyAccessToken(token);
        const userId = (payload as any).sub;
        if (!userId) {
            throw new AuthFailureError("User not found");
        }
        return userId;
    }

    findAll = async (req: Request, res: Response) => {
        const data = await this.userService.findAll();
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get all users successfullly!',
            data,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }

    findByID = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            throw new BadRequestError('User ID is required for searching!')
        }
        const data = await this.userService.findById(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get user by ID successfullly!',
            data,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }

    updateProfile = async (req: Request, res: Response) => {
        const id = this.getUserIdFromAuth(req);
        if (!id) {
            throw new AuthFailureError('Authentication failure');
        }
        const payload: PatchUserProfileRequest = req.body;
        const data = await this.userService.updateProfile(id, payload);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Update user profile successfully!',
            data,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

    uploadAvatar = async (req: Request, res: Response) => {
        const id = this.getUserIdFromAuth(req);
        if (!id) {
            throw new AuthFailureError('Authentication failure');
        }
        const file = (req as Request & { file?: Express.Multer.File }).file;
        if (!file) {
            throw new BadRequestError('Avatar file is required');
        }

        const data = await this.userService.uploadAvatar(id, file);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Upload avatar successfully!',
            data,
            StatusCodes.OK
        );
        return handleServiceResponse(serviceResponse, res);
    }

}
