import { AppDataSource } from "@/config/db.config";
import { Role, RoleScope } from "@/common/entities/role.entity";
import { Permission } from "@/common/entities/permission.entity";
import { RolePermission } from "@/common/entities/role-permission.entity";
import { CreateWorkspaceRoleDto, UpdateWorkspaceRoleDto } from "./dto/workspace-role.dto";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/common/handler/error.response";
import { RoleRepository } from "../role/repositories/role.repository";
import { PermissionRepository } from "../permission/repositories/permission.repository";
import { RolePermissionRepository } from "../role-permission/repositories/role-permission.repository";
import { IRoleRepository } from "../role/repositories/role.repository.interface";
import { IPermissionRepository } from "../permission/repositories/permission.repository.interface";
import { IRolePermissionRepository } from "../role-permission/repositories/role-permission.repository.interface";

export class WorkspaceRoleService {
    constructor(
        private roleRepo: IRoleRepository,
        private permissionRepo: IPermissionRepository,
        private rolePermissionRepo: IRolePermissionRepository
    ) { }

    async getRoles(workspaceId: string) {
        return await this.roleRepo.findWorkspaceRoles(workspaceId);
    }

    async createRole(workspaceId: string, dto: CreateWorkspaceRoleDto) {
        const { name, description, permissions } = dto;

        const existing = await this.roleRepo.findByNameAndWorkspaceId(
            name,
            RoleScope.WORKSPACE,
            workspaceId
        );

        if (existing) {
            throw new BadRequestError("Role name already exists in this workspace");
        }

        const role = this.roleRepo.create({
            name,
            description: description || '',
            scope: RoleScope.WORKSPACE,
            workspaceId,
            isSystemRole: false,
        });
        await this.roleRepo.save(role);

        if (permissions && permissions.length > 0) {
            const perms = await this.permissionRepo.findByActions(permissions);

            const rolePermissions = perms.map((p) =>
                this.rolePermissionRepo.create({
                    roleId: role.id,
                    permissionId: p.id,
                })
            );

            await this.rolePermissionRepo.save(rolePermissions);
        }

        const createdRole = await this.roleRepo.findByIdWithRelations(role.id);
        if (!createdRole) {
            throw new NotFoundError("Failed to retrieve created role");
        }
        return createdRole;
    }

    async updateRole(workspaceId: string, roleId: string, dto: UpdateWorkspaceRoleDto) {
        const role = await this.roleRepo.findByIdWithRelations(roleId);

        if (!role) throw new NotFoundError("Role not found");

        if (role.scope !== RoleScope.WORKSPACE) {
            throw new BadRequestError("Only workspace roles can be updated here");
        }
        if (role.isSystemRole && role.workspaceId === null) {
            throw new ForbiddenError("System roles cannot be modified");
        }

        if (role.workspaceId !== workspaceId) {
            throw new ForbiddenError("Role does not belong to this workspace");
        }

        if (dto.name) role.name = dto.name;
        if (dto.description !== undefined) role.description = dto.description;

        await this.roleRepo.save(role);

        if (dto.permissions) {
            // clear old permissions
            await this.rolePermissionRepo.deleteByRoleId(role.id);

            if (dto.permissions.length > 0) {
                const perms = await this.permissionRepo.findByActions(dto.permissions);

                const rolePermissions = perms.map((p) =>
                    this.rolePermissionRepo.create({
                        roleId: role.id,
                        permissionId: p.id,
                    })
                );

                await this.rolePermissionRepo.save(rolePermissions);
            }
        }

        const updatedRole = await this.roleRepo.findByIdWithRelations(role.id);
        if (!updatedRole) {
            throw new NotFoundError("Failed to retrieve updated role");
        }
        return updatedRole;
    }

    async deleteRole(workspaceId: string, roleId: string) {
        const role = await this.roleRepo.findById(roleId);

        if (!role) throw new NotFoundError("Role not found");

        if (role.scope !== RoleScope.WORKSPACE) {
            throw new BadRequestError("Only workspace roles can be deleted here");
        }

        if (role.isSystemRole && role.workspaceId === null) {
            throw new ForbiddenError("System roles cannot be deleted");
        }

        if (role.workspaceId !== workspaceId) {
            throw new ForbiddenError("Role does not belong to this workspace");
        }

        await this.roleRepo.delete(roleId);
    }
}
