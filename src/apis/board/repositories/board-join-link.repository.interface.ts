import { BoardJoinLink } from "@/common/entities/board-join-link.entity";

export interface IBoardJoinLinkRepository {
    findById(id: string): Promise<BoardJoinLink | null>;
    findByToken(token: string): Promise<BoardJoinLink | null>;
    findByBoardId(boardId: string): Promise<BoardJoinLink[]>;
    create(data: Partial<BoardJoinLink>): Promise<BoardJoinLink>;
    save(link: BoardJoinLink): Promise<BoardJoinLink>;
    delete(id: string): Promise<any>;
    incrementUsedCount(id: string): Promise<void>;
}
