import { Role, RoleScope } from "@/common/entities/role.entity";
import { IBaseRepository } from "@/common/repositories/base.repository.interface";

export interface IRoleRepository {
    // Define methods for role repository
    findByName(name: string, scope: RoleScope): Promise<Role | null>;
    findById(id: string, scope: RoleScope): Promise<Role | null>;
}