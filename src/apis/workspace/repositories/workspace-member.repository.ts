import { WorkspaceMember } from "@/common/entities/workspace-member.entity";
import { IWorkspaceMemberRepository } from "./workspace-member.repository.interface";
import { Repository } from "typeorm";

export class WorkspaceMemberRepository implements IWorkspaceMemberRepository {
    constructor(
        private readonly workspaceMemberRepository: Repository<WorkspaceMember>
    ) { }
    async findById(id: string): Promise<WorkspaceMember | null> {
        return await this.workspaceMemberRepository.findOne({ where: { id }, relations: ['user', 'workspace', 'role'] });
    }
    async findByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]> {
        return await this.workspaceMemberRepository.find({
            where: { workspaceId },
            relations: ['user', 'workspace', 'role'],
            select: { user: { id: true, fullname: true, email: true, avatarUrl: true }, workspace: { id: true, title: true } }
        });
    }
    async findByUserId(userId: string): Promise<WorkspaceMember[]> {
        return await this.workspaceMemberRepository.find({
            where: { userId },
            relations: ['user', 'workspace', 'role']
        });
    }
    async findByWorkspaceAndUserId(workspaceId: string, userId: string): Promise<WorkspaceMember | null> {
        return await this.workspaceMemberRepository.findOne({ where: { workspaceId, userId }, relations: ['user', 'workspace', 'role'] });
    }
    async create(data: Partial<WorkspaceMember>): Promise<WorkspaceMember> {
        const workspaceMember = this.workspaceMemberRepository.create(data);
        return await this.workspaceMemberRepository.save(workspaceMember);
    }
    async update(id: string, data: Partial<WorkspaceMember>): Promise<WorkspaceMember> {
        return await this.workspaceMemberRepository.save({ id, ...data });
    }
    async delete(workspaceMember: WorkspaceMember): Promise<void> {
        await this.workspaceMemberRepository.remove(workspaceMember);
    }
}