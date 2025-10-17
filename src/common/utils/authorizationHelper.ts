import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Workspace } from "../entities/workspace.entity";
import { Board } from "../entities/board.entity";
import { WorkspaceMember } from "../entities/workspace-member.entity";
import { BoardMember } from "../entities/board-member.entity";
import { AppDataSource } from "@/config/db.config";
import { ResourceType } from "../entities/permission.entity";
import { Role } from "../entities/role.entity";

export class AuthorizationHelper {
    private workspaceMemberRepository: Repository<WorkspaceMember>;
    private boardMemberRepository: Repository<BoardMember>;
    private workspaceRepository: Repository<Workspace>;
    private boardRepository: Repository<Board>;
    constructor() {
        this.workspaceMemberRepository = AppDataSource.getRepository(WorkspaceMember);
        this.boardMemberRepository = AppDataSource.getRepository(BoardMember);
        this.workspaceRepository = AppDataSource.getRepository(Workspace);
        this.boardRepository = AppDataSource.getRepository(Board);
    }
    async canAccessWorkspace(
        userId: string,
        workspaceId: string,
        requiredPermission: string
    ): Promise<boolean> {
        try {
            const workspace = await this.workspaceRepository.findOne({
                where: { id: workspaceId }
            });

            if (!workspace) {
                return false;
            }

            if (workspace.ownerId === userId) {
                return true;
            }
            const workspaceMember = await this.workspaceMemberRepository.findOne({
                where: { userId, workspaceId },
                relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission']
            });

            if (!workspaceMember) {
                return false;
            }
            return this.hasPermission(
                workspaceMember.role,
                requiredPermission,
                ResourceType.WORKSPACE
            );
        } catch (error) {
            console.error('Error checking workspace access:', error);
            return false;
        }
    }
    async canAccessBoard(
        userId: string,
        boardId: string,
        requiredPermission: string
    ): Promise<boolean> {
        try {
            const board = await this.boardRepository.findOne({
                where: { id: boardId },
                relations: ['workspace']
            });

            if (!board) {
                return false;
            }
            if (board.workspace.ownerId === userId) {
                return true;
            }

            const boardMember = await this.boardMemberRepository.findOne({
                where: { userId, boardId },
                relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission']
            });

            if (boardMember) {
                const hasBoardPermission = this.hasPermission(
                    boardMember.role,
                    requiredPermission,
                    ResourceType.WORKSPACE
                );

                if (hasBoardPermission) {
                    return true;
                }
            }

            const workspaceMember = await this.workspaceMemberRepository.findOne({
                where: { userId, workspaceId: board.workspaceId },
                relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission']
            });

            if (!workspaceMember) {
                return false;
            }

            return this.hasPermission(
                workspaceMember.role,
                requiredPermission,
                ResourceType.WORKSPACE
            );
        } catch (error) {
            console.error('Error checking board access:', error);
            return false;
        }
    }
    async isWorkspaceOwner(userId: string, workspaceId: string): Promise<boolean> {
        try {
            const workspace = await this.workspaceRepository.findOne({
                where: { id: workspaceId }
            });

            return workspace?.ownerId === userId;
        } catch (error) {
            console.error('Error checking workspace owner:', error);
            return false;
        }
    }
    private hasPermission(
        role: Role,
        requiredAction: string,
        resourceType: ResourceType
    ): boolean {
        if (!role || !role.rolePermissions) {
            return false;
        }

        return role.rolePermissions.some(rp => {
            const permission = rp.permission;
            return (
                permission.action === requiredAction &&
                permission.resourceType === resourceType
            );
        });
    }
}