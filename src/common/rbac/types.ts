import { RoleScope } from "../entities/role.entity";
import { Role } from "../entities/role.entity";

export type MembershipScope = RoleScope;

export interface Membership {
    scope: MembershipScope;
    role: Role;
    workspaceId: string;
    boardId: string;
}   