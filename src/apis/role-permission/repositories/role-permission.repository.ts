import { Repository } from "typeorm";
import { IRolePermissionRepository } from "./role-permission.repository.interface";
import { RolePermission } from "@/common/entities/role-permission.entity";

export class RolePermissionRepository implements IRolePermissionRepository {
    constructor(
        private readonly rolePermissionRepository: Repository<RolePermission>
    ) { }

    create(data: Partial<RolePermission>): RolePermission {
        return this.rolePermissionRepository.create(data);
    }

    async save(rolePermissions: RolePermission[]): Promise<RolePermission[]> {
        return await this.rolePermissionRepository.save(rolePermissions);
    }

    async deleteByRoleId(roleId: string): Promise<void> {
        await this.rolePermissionRepository.delete({ roleId });
    }
}