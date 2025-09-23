import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { handleServiceResponse } from "@/common/utils/httpHandler";
export default class HealthCheckController {
    constructor() { }
    healthCheck = async (req: Request, res: Response) => {
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Service is healthy',
            null,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res)
    }
}