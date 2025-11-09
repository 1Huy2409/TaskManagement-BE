import { Workspace } from "@/common/entities/workspace.entity";
import { IBaseRepository } from "@/common/repositories/base.repository.interface";

export interface IWorkspaceRepository extends IBaseRepository<Workspace> {
    findAll(): Promise<Workspace[]>;
    findByName(name: string, ownerId: string): Promise<Workspace | null>;
    findByOwnerId(ownerId: string): Promise<Workspace[]>;
    findOneByOwnerId(id: string, ownerId: string): Promise<Workspace | null>;
    findByUserId(userId: string): Promise<Workspace[]>;
    findById(id: string): Promise<Workspace | null>;
    create(data: Partial<Workspace>): Promise<Workspace>;
    update(id: string, data: Partial<Workspace>): Promise<Workspace>;
    delete(id: string): Promise<any>;
}