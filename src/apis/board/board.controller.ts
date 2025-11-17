import { Request, Response } from "express";
import BoardService from "./board.service";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import { StatusCodes } from "http-status-codes";
import { handleServiceResponse } from "@/common/utils/httpHandler";
import { BadRequestError } from "@/common/handler/error.response";

export default class BoardController {
    constructor(
        private boardService: BoardService
    ) { }
    getAllPublicBoards = async (req: Request, res: Response) => {
        const boards = await this.boardService.getAllPublicBoards();
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get all public boards successfully',
            boards,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    getPublicBoardById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('Board id is required')
        }
        const board = await this.boardService.getPublicBoardById(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get public board by ID successfully',
            board,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    deleteBoard = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('Board id is required')
        }
        await this.boardService.delete(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Delete board successfully',
            null,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
}