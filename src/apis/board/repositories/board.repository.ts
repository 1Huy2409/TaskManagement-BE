import { Repository } from "typeorm";
import { IBoardRepository } from "./board.repository.interface";
import { Board, BoardVisibility } from "@/common/entities/board.entity";
import { NotFoundError } from "@/common/handler/error.response";
export class BoardRepository implements IBoardRepository {
    constructor(private boardRepository: Repository<Board>) { }

    async findById(id: string): Promise<Board | null> {
        return await this.boardRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Board[]> {
        return await this.boardRepository.find();
    }

    async findPublicBoards(): Promise<Board[]> {
        return await this.boardRepository.find({
            where: { visibility: BoardVisibility.PUBLIC, isActive: true }
        });
    }

    async findPublicBoardById(id: string): Promise<Board | null> {
        return await this.boardRepository.findOne({
            where: { id, visibility: BoardVisibility.PUBLIC, isActive: true }
        });
    }

    async findBoardsByWorkspaceId(workspaceId: string): Promise<Board[]> {
        return await this.boardRepository.find({
            where: { workspaceId: workspaceId, isActive: true }
        });
    }

    async findBoardByWorkspaceId(id: string, workspaceId: string): Promise<Board | null> {
        return await this.boardRepository.findOne({
            where: { id, workspaceId: workspaceId, isActive: true }
        });
    }

    async create(data: Partial<Board>): Promise<Board> {
        const board = this.boardRepository.create(data);
        return await this.boardRepository.save(board);
    }

    async update(id: string, data: Partial<Board>): Promise<Board> {
        return await this.boardRepository.save({ id, ...data });
    }

    async delete(id: string): Promise<any> {
        const board = await this.boardRepository.findOne({ where: { id } });
        if (!board) {
            throw new NotFoundError(`Board with ID ${id} not found`);
        }
        board.isActive = false;
        await this.boardRepository.save(board);
        return {
            message: 'Board deleted successfully'
        }
    }
}