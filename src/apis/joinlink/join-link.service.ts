import { BadRequestError, ConflictRequestError, NotFoundError } from "@/common/handler/error.response";
import { IRoleRepository } from "../role/repositories/role.repository.interface";
import { IWorkspaceMemberRepository } from "../workspace/repositories/workspace-member.repository.interface";
import { IWorkspaceRepository } from "../workspace/repositories/workspace.repository.interface";
import { IJoinLinkRepository } from "./repositories/join-link.repository.interface";
import { CreateJoinLinkDto, JoinLinkResponse } from "./schemas/join-link.schema";
import { nanoid } from "nanoid";
import { toJoinLinkResponse } from "./mapper/join-link.mapper";
import { WorkspaceJoinLink } from "@/common/entities/workspace-join-link.entity";
import { RoleScope } from "@/common/entities/role.entity";
import { Workspace } from "@/common/entities/workspace.entity";

export class JoinLinkService {
    constructor(
        private readonly joinLinkRepository: IJoinLinkRepository,
        private readonly workspaceRepository: IWorkspaceRepository,
        private readonly workspaceMemberRepository: IWorkspaceMemberRepository,
        private readonly roleRepository: IRoleRepository,
    ) { }

    createJoinLink = async (workspaceId: string,
        userId: string,
        data: CreateJoinLinkDto
    ): Promise<JoinLinkResponse> => {
        const worspace = await this.workspaceRepository.findById(workspaceId);
        if (!worspace) {
            throw new NotFoundError('Workspace not found');
        }
        const token = nanoid(10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + data.expiresIn);
        const joinLink = await this.joinLinkRepository.create({
            workspaceId,
            token,
            createdBy: userId,
            expiresAt,
            maxUses: data.maxUses || 10,
            usedCount: 0,
            isActive: true,
        })
        const savedLink = await this.joinLinkRepository.save(joinLink);
        return toJoinLinkResponse(savedLink);
    }
    joinByLink = async (token: string, userId: string): Promise<{ message: string, workspace: Workspace }> => {
        const joinLink = await this.joinLinkRepository.findByToken(token);
        if (!joinLink) {
            throw new NotFoundError('Join link not found or inactive');
        }
        await this.validateJoinLink(joinLink);
        const isMember = await this.workspaceMemberRepository.findByWorkspaceAndUserId(joinLink.workspaceId, userId);
        if (isMember) {
            throw new ConflictRequestError('User is already a member of the workspace');
        }
        const memberRole = await this.roleRepository.findByName('workspace_member', RoleScope.WORKSPACE);
        if (!memberRole) {
            throw new NotFoundError('Member role not found');
        }
        await this.workspaceMemberRepository.create({
            workspaceId: joinLink.workspaceId,
            userId,
            roleId: memberRole.id,
        });
        await this.joinLinkRepository.incrementUsedCount(joinLink.id);
        if (joinLink.maxUses && joinLink.usedCount + 1 >= joinLink.maxUses) {
            joinLink.isActive = false;
            await this.joinLinkRepository.save(joinLink);
        }
        return {
            message: 'Successfully joined the workspace',
            workspace: joinLink.workspace,
        }
    }
    getWorkspaceJoinLinks = async (workspaceId: string): Promise<JoinLinkResponse[]> => {
        const joinLinks = await this.joinLinkRepository.findByWorkspaceId(workspaceId);
        return joinLinks.map(toJoinLinkResponse);
    }
    revokeJoinLink = async (joinLinkId: string, workspaceId: string): Promise<{ message: string }> => {
        const joinLink = await this.joinLinkRepository.findById(joinLinkId);
        if (!joinLink) {
            throw new NotFoundError('Join link not found');
        }
        if (joinLink.workspaceId !== workspaceId) {
            throw new BadRequestError('Join link does not belong to the specified workspace');
        }
        joinLink.isActive = false;
        await this.joinLinkRepository.save(joinLink);
        return { message: 'Join link revoked successfully' }
    }
    deleteJoinLink = async (joinLinkId: string, workspaceId: string): Promise<{ message: string }> => {
        const joinLink = await this.joinLinkRepository.findById(joinLinkId);
        if (!joinLink) {
            throw new NotFoundError('Join link not found');
        }
        if (joinLink.workspaceId !== workspaceId) {
            throw new BadRequestError('Join link does not belong to the specified workspace');
        }
        await this.joinLinkRepository.delete(joinLinkId);
        return { message: 'Join link deleted successfully' }
    }

    private async validateJoinLink(joinLink: WorkspaceJoinLink): Promise<void> {
        if (new Date() > joinLink.expiresAt) {
            throw new BadRequestError('Join link has expired');
        }
        if (!joinLink.isActive) {
            throw new BadRequestError('Join link is inactive');
        }
        if (joinLink.maxUses && joinLink.usedCount >= joinLink.maxUses) {
            throw new BadRequestError('Join link has reached its maximum uses');
        }
    }
}