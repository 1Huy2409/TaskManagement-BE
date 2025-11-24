import { Permission } from "@/common/entities/permission.entity";

export interface IPermissionRepository {
    findByActions(actions: string[]): Promise<Permission[]>;
    findAll(): Promise<Permission[]>;
}