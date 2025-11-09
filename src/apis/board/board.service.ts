import { BoardMember } from "@/common/entities/board-member.entity";
import { Board, BoardVisibility } from "@/common/entities/board.entity";
import { Repository } from "typeorm";
import { BoardResponse } from "./schemas";
import { NotFoundError } from "@/common/handler/error.response";
import { toBoardResponse } from "./mapper/board.mapper";
import { IBoardRepository } from "./repositories/board.repository.interface";

export default class BoardService {
    constructor(
        private boardRepository: IBoardRepository,
    ) { }

    // get board with visibility is public
    getAllPublicBoards = async (): Promise<BoardResponse[]> => {
        const boards = await this.boardRepository.findPublicBoards();
        if (!boards.length) {
            throw new NotFoundError('No public boards found');
        }
        return boards.map(toBoardResponse)
    }
    getPublicBoardById = async (id: string): Promise<BoardResponse> => {
        const board = await this.boardRepository.findPublicBoardById(id);
        if (!board) {
            throw new NotFoundError(`Board with ID ${id} not found`);
        }
        return toBoardResponse(board);
    }
}