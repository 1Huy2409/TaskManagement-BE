import { Repository } from "typeorm";
import { IRoleRepository } from "./role.repository.interface";
import { Role, RoleScope } from "@/common/entities/role.entity";

export class RoleRepository implements IRoleRepository {
    constructor(
        private readonly roleRepository: Repository<Role>
    ) { }
    async findByName(name: string, scope: RoleScope): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ name, scope });
    }
    async findById(id: string, scope: RoleScope): Promise<Role | null> {
        return await this.roleRepository.findOneBy({ id, scope });
    }
}