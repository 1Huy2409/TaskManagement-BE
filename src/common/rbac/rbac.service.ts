import { AppDataSource } from "@/config/db.config";
import { Workspace } from "../entities/workspace.entity";
import { Board } from "../entities/board.entity";
import { WorkspaceMember } from "../entities/workspace-member.entity";
import { BoardMember } from "../entities/board-member.entity";
import { Permission, ResourceType } from "../entities/permission.entity";
import { Role, RoleScope } from "../entities/role.entity";
import { PermissionKey } from "../constants/permissions";


export class RbacService {
    private workspaceRepo = AppDataSource.getRepository(Workspace)
    private boardRepo = AppDataSource.getRepository(Board)
    private workspaceMemberRepo = AppDataSource.getRepository(WorkspaceMember)
    private boardMemberRepo = AppDataSource.getRepository(BoardMember)
    private permissionRepo = AppDataSource.getRepository(Permission)

    constructor() { }

    async canUser(
        userId: string,
        permissionAction: PermissionKey,
        context?: { workspaceId?: string; boardId?: string }
    ): Promise<boolean> {
        let { workspaceId, boardId } = context || {};

        if (boardId && !workspaceId) {
            const board = await this.boardRepo.findOne({
                where: { id: boardId },
                relations: ["workspace"],
            });
            if (!board) return false;

            workspaceId = board.workspaceId;

            if (board.workspace.ownerId === userId) {
                return true;
            }
        }

        if (workspaceId && !boardId) {
            const workspace = await this.workspaceRepo.findOne({
                where: { id: workspaceId },
            });
            if (!workspace) return false;
            if (workspace.ownerId === userId) {
                return true;
            }
        }

        const memberships: { scope: RoleScope; role: Role }[] = [];
        if (boardId) {
            const boardMember = await this.boardMemberRepo.findOne({
                where: { userId, boardId },
                relations: ["role", "role.rolePermissions", "role.rolePermissions.permission"],
            });

            if (boardMember) {
                memberships.push({
                    scope: RoleScope.BOARD,
                    role: boardMember.role,
                });
            }
        }

        if (workspaceId) {
            const workspaceMember = await this.workspaceMemberRepo.findOne({
                where: { userId, workspaceId },
                relations: ["role", "role.rolePermissions", "role.rolePermissions.permission"],
            });

            if (workspaceMember) {
                memberships.push({
                    scope: RoleScope.WORKSPACE,
                    role: workspaceMember.role,
                });
            }
        }

        const priority = {
            [RoleScope.BOARD]: 3,
            [RoleScope.WORKSPACE]: 2,
            [RoleScope.GLOBAL]: 1,
        } as const;

        memberships.sort((a, b) => priority[b.scope] - priority[a.scope]);

        for (const m of memberships) {
            const resourceType = this.mapScopeToResourceType(m.scope);
            if (this.roleHasPermission(m.role, permissionAction, resourceType)) {
                return true;
            }
        }

        return false;
    }


    private mapScopeToResourceType(scope: RoleScope): ResourceType {
        switch (scope) {
            case RoleScope.WORKSPACE:
                return ResourceType.WORKSPACE;
            case RoleScope.BOARD:
                return ResourceType.BOARD;
            case RoleScope.GLOBAL:
            default:
                return ResourceType.GLOBAL;
        }
    }

    private roleHasPermission(
        role: Role,
        requiredAction: string,
        resourceType: ResourceType
    ): boolean {
        if (!role || !role.rolePermissions) {
            return false;
        }
        return role.rolePermissions.some((rp) => {
            const permission = rp.permission;
            return permission.action === requiredAction && permission.resourceType === resourceType;
        })
    }
}