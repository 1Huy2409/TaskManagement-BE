import { IBaseRepository } from "@/common/repositories/base.repository.interface";
import { Board } from "@/common/entities/board.entity";
export interface IBoardRepository extends IBaseRepository<Board> {
    findById(id: string): Promise<Board | null>;
    findAll(): Promise<Board[]>;
    findPublicBoards(): Promise<Board[]>;
    findPublicBoardById(id: string): Promise<Board | null>;
    findBoardsByWorkspaceId(workspaceId: string): Promise<Board[]>;
    findBoardByWorkspaceId(id: string, workspaceId: string): Promise<Board | null>;
    findByTitleAndWorkspaceId(title: string, workspaceId: string): Promise<Board | null>;
    create(data: Partial<Board>): Promise<Board>;
    update(id: string, data: Partial<Board>): Promise<Board>;
    delete(id: string): Promise<any>;
    reopen(id: string): Promise<any>;
    deletePermanent(id: string): Promise<any>;
    changeOwner(id: string, ownerId: string): Promise<Board>;
}