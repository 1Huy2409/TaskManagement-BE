import UserService from "./user.service";
import type { Express, Request, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandler";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "@/common/handler/error.response";
import { PatchUserProfileRequest } from "./schemas";

export default class UserController {
    constructor(
        private userService: UserService
    ) {
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
        const id = req.params.id;
        if (!id) {
            throw new BadRequestError('User ID is required for updating!');
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
        const id = req.params.id;
        if (!id) {
            throw new BadRequestError('User ID is required for uploading avatar!');
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
