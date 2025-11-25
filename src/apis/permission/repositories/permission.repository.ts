import { Repository, In } from "typeorm";
import { IPermissionRepository } from "./permission.repository.interface";
import { Permission } from "@/common/entities/permission.entity";

export class PermissionRepository implements IPermissionRepository {
    constructor(
        private readonly permissionRepository: Repository<Permission>
    ) { }

    async findByActions(actions: string[]): Promise<Permission[]> {
        return await this.permissionRepository.findBy({
            action: In(actions),
        });
    }

    async findAll(): Promise<Permission[]> {
        return await this.permissionRepository.find();
    }
}