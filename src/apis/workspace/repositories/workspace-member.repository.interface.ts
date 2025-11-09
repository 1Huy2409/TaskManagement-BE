import { WorkspaceMember } from "@/common/entities/workspace-member.entity";

export interface IWorkspaceMemberRepository {
    findById(id: string): Promise<WorkspaceMember | null>;
    findByWorkspaceId(workspaceId: string): Promise<WorkspaceMember[]>;
    findByUserId(userId: string): Promise<WorkspaceMember[]>;
    findByWorkspaceAndUserId(workspaceId: string, userId: string): Promise<WorkspaceMember | null>;
    create(data: Partial<WorkspaceMember>): Promise<WorkspaceMember>;
    update(id: string, data: Partial<WorkspaceMember>): Promise<WorkspaceMember>;
    delete(workspaceMember: WorkspaceMember): Promise<void>;
}