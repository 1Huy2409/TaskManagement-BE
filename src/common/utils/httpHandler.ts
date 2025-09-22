import type { Response } from "express";
import type { ServiceResponse } from "../models/service.response.js";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, res: Response) => {
    return res.status(serviceResponse.statusCode).send(serviceResponse);
}
// write validate request function