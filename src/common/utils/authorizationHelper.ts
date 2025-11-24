// src/utils/authorizationHelper.ts
import { Repository } from "typeorm";
import { Workspace } from "../entities/workspace.entity";
import { Board } from "../entities/board.entity";
import { AppDataSource } from "@/config/db.config";
import { RbacService } from "../rbac/rbac.service";
import { PermissionKey } from "../constants/permissions";

export class AuthorizationHelper {
    private workspaceRepository: Repository<Workspace>;
    private boardRepository: Repository<Board>;
    private rbacService: RbacService;

    constructor() {
        this.workspaceRepository = AppDataSource.getRepository(Workspace);
        this.boardRepository = AppDataSource.getRepository(Board);
        this.rbacService = new RbacService();
    }

    async canAccessWorkspace(
        userId: string,
        workspaceId: string,
        requiredPermission: PermissionKey
    ): Promise<boolean> {
        const workspace = await this.workspaceRepository.findOne({
            where: { id: workspaceId },
        });

        if (!workspace) return false;
        if (workspace.ownerId === userId) {
            return true;
        }

        return this.rbacService.canUser(userId, requiredPermission, { workspaceId });
    }

    async canAccessBoard(
        userId: string,
        boardId: string,
        requiredPermission: PermissionKey
    ): Promise<boolean> {
        return this.rbacService.canUser(userId, requiredPermission, { boardId });
    }

    async isWorkspaceOwner(userId: string, workspaceId: string): Promise<boolean> {
        const workspace = await this.workspaceRepository.findOne({
            where: { id: workspaceId },
        });

        return workspace?.ownerId === userId;
    }
}
