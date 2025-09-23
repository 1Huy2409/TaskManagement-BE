import type { ErrorRequestHandler } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import type { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "./error.response";
export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    if (err instanceof ErrorResponse) {
        return res.status(err.statusCode).json({
            success: false,
            code: err.code,
            message: err.message,
            statusCode: err.statusCode
        })
    }
    return res.status(status).json({
        success: false,
        code: err.code,
        message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
    })
}