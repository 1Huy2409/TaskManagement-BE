import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Role } from "./role.entity";
import { Permission } from "./permission.entity";

@Entity('role-permission')
@Unique('UQ_role_permission', ['role', 'permission'])
export class RolePermission extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid' })
    roleId: string

    @Column({ type: 'uuid' })
    permissionId: string

    @ManyToOne(() => Role, (role) => role.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'roleId' })
    role: Role

    @ManyToOne(() => Permission, (permission) => permission.rolePermissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permissionId' })
    permission: Permission
}