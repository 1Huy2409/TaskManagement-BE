import { StatusCodes, ReasonPhrases } from "http-status-codes";

class ErrorResponse extends Error {
    public statusCode: number;
    public code: string | undefined;

    constructor(message: string, statusCode: number, code?: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.name = this.constructor.name;
        
        // Capture stack trace for better debugging
        Error.captureStackTrace(this, this.constructor);
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.CONFLICT,
        statusCode: number = StatusCodes.CONFLICT
    ) {
        super(message, statusCode, 'CONFLICT_ERROR');
    }
}

class BadRequestError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.BAD_REQUEST,
        statusCode: number = StatusCodes.BAD_REQUEST
    ) {
        super(message, statusCode, 'BAD_REQUEST_ERROR');
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.UNAUTHORIZED,
        statusCode: number = StatusCodes.UNAUTHORIZED
    ) {
        super(message, statusCode, 'AUTH_FAILURE_ERROR');
    }
}

class NotFoundError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.NOT_FOUND,
        statusCode: number = StatusCodes.NOT_FOUND
    ) {
        super(message, statusCode, 'NOT_FOUND_ERROR');
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.FORBIDDEN,
        statusCode: number = StatusCodes.FORBIDDEN
    ) {
        super(message, statusCode, 'FORBIDDEN_ERROR');
    }
}

class InternalServerError extends ErrorResponse {
    constructor(
        message: string = ReasonPhrases.INTERNAL_SERVER_ERROR,
        statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message, statusCode, 'INTERNAL_SERVER_ERROR');
    }
}

class ValidationError extends ErrorResponse {
    constructor(
        message: string = 'Validation failed',
        statusCode: number = StatusCodes.UNPROCESSABLE_ENTITY
    ) {
        super(message, statusCode, 'VALIDATION_ERROR');
    }
}

export {
    ErrorResponse,
    ConflictRequestError,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError,
    InternalServerError,
    ValidationError,
};