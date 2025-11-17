import { WorkspaceJoinLink } from "@/common/entities/workspace-join-link.entity";

export interface IJoinLinkRepository {
    findById(id: string): Promise<WorkspaceJoinLink | null>;
    findByToken(token: string): Promise<WorkspaceJoinLink | null>;
    findByWorkspaceId(workspaceId: string): Promise<WorkspaceJoinLink[]>;
    create(data: Partial<WorkspaceJoinLink>): Promise<WorkspaceJoinLink>;
    save(link: WorkspaceJoinLink): Promise<WorkspaceJoinLink>;
    delete(id: string): Promise<any>;
    incrementUsedCount(id: string): Promise<void>;
}