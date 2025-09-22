import UserService from "./user.service.js";
import type { Request, Response } from "express";
import { handleServiceResponse } from "@/common/utils/httpHandler.js";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "@/common/handler/error.response.js";

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

}