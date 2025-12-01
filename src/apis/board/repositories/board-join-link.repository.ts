import { Repository } from 'typeorm';
import { IBoardJoinLinkRepository } from './board-join-link.repository.interface';
import { BoardJoinLink } from '@/common/entities/board-join-link.entity';

export class BoardJoinLinkRepository implements IBoardJoinLinkRepository {
    constructor(
        private readonly boardJoinLinkRepository: Repository<BoardJoinLink>
    ) { }

    async findById(id: string): Promise<BoardJoinLink | null> {
        return this.boardJoinLinkRepository.findOne({
            where: { id },
            relations: ['board']
        });
    }

    async findByToken(token: string): Promise<BoardJoinLink | null> {
        return this.boardJoinLinkRepository.findOne({
            where: { token, isActive: true },
            relations: ['board']
        });
    }

    async findByBoardId(boardId: string): Promise<BoardJoinLink[]> {
        return this.boardJoinLinkRepository.find({
            where: { boardId, isActive: true },
            relations: ['board']
        });
    }

    async create(data: Partial<BoardJoinLink>): Promise<BoardJoinLink> {
        const joinLink = this.boardJoinLinkRepository.create(data);
        return this.boardJoinLinkRepository.save(joinLink);
    }

    async save(link: BoardJoinLink): Promise<BoardJoinLink> {
        return this.boardJoinLinkRepository.save(link);
    }

    async delete(id: string): Promise<any> {
        return this.boardJoinLinkRepository.delete(id);
    }

    async incrementUsedCount(id: string): Promise<void> {
        await this.boardJoinLinkRepository
            .createQueryBuilder()
            .update(BoardJoinLink)
            .set({ usedCount: () => "usedCount + 1" })
            .where("id = :id", { id })
            .execute();
    }
}
