import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { WorkspaceMember } from "./workspace-member.entity";
import { BoardMember } from "./board-member.entity";
import { RolePermission } from "./role-permission.entity";

export enum RoleScope {
    GLOBAL = 'global',
    WORKSPACE = 'workspace',
    BOARD = 'board'
}
@Entity('roles')
@Unique('UQ_role_name_scope', ['name', 'scope'])
export class Role extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'enum', enum: RoleScope })
    scope: RoleScope

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'boolean', default: false })
    isSystemRole: boolean

    @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
    rolePermissions: RolePermission[]

    @OneToMany(() => WorkspaceMember, (member) => member.role)
    workspaceMembers: WorkspaceMember[]

    @OneToMany(() => BoardMember, (member) => member.role)
    boardMembers: BoardMember[]

}