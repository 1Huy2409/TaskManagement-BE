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
    delete = async (id: string): Promise<any> => {
        return await this.boardRepository.delete(id);
    }

    reopen = async (id: string): Promise<any> => {
        return await this.boardRepository.reopen(id);
    }

    deletePermanent = async (id: string): Promise<any> => {
        return await this.boardRepository.deletePermanent(id);
    }

    changeOwner = async (id: string, ownerId: string): Promise<BoardResponse> => {
        const board = await this.boardRepository.changeOwner(id, ownerId);
        return toBoardResponse(board);
    }
}