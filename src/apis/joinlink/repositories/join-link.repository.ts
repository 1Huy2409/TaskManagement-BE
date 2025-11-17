import { Repository } from 'typeorm';
import { IJoinLinkRepository } from './join-link.repository.interface';
import { WorkspaceJoinLink } from '@/common/entities/workspace-join-link.entity';
export class JoinLinkRepository implements IJoinLinkRepository {
    constructor(
        private readonly joinLinkRepository: Repository<WorkspaceJoinLink>
    ) { }
    async findById(id: string): Promise<WorkspaceJoinLink | null> {
        return this.joinLinkRepository.findOne({
            where: { id }, relations: [
                'workspace',
            ]
        });
    }
    async findByToken(token: string): Promise<WorkspaceJoinLink | null> {
        return this.joinLinkRepository.findOne({
            where: { token, isActive: true }, relations: [
                'workspace',
            ]
        });
    }
    async findByWorkspaceId(workspaceId: string): Promise<WorkspaceJoinLink[]> {
        return this.joinLinkRepository.find({
            where: { workspaceId, isActive: true }, relations: [
                'workspace',
            ]
        });
    }
    async create(data: Partial<WorkspaceJoinLink>): Promise<WorkspaceJoinLink> {
        const joinLink = this.joinLinkRepository.create(data);
        return this.joinLinkRepository.save(joinLink);
    }
    async save(link: WorkspaceJoinLink): Promise<WorkspaceJoinLink> {
        return this.joinLinkRepository.save(link);
    }
    async delete(id: string): Promise<any> {
        return this.joinLinkRepository.delete(id);
    }
    async incrementUsedCount(id: string): Promise<void> {
        await this.joinLinkRepository
            .createQueryBuilder()
            .update(WorkspaceJoinLink)
            .set({ usedCount: () => "usedCount + 1" })
            .where("id = :id", { id })
            .execute();
    }
}