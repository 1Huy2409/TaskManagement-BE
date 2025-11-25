import { RolePermission } from "@/common/entities/role-permission.entity";

export interface IRolePermissionRepository {
    create(data: Partial<RolePermission>): RolePermission;
    save(rolePermissions: RolePermission[]): Promise<RolePermission[]>;
    deleteByRoleId(roleId: string): Promise<void>;
}