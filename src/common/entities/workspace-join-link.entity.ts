import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Workspace } from "./workspace.entity";
import { User } from "./user.entity";

@Entity('workspace-join-links')
export class WorkspaceJoinLink extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid' })
    workspaceId: string

    @Column({ type: 'varchar', length: 64, unique: true })
    token: string

    @Column({ type: 'uuid', nullable: true })
    createdBy: string

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date

    @Column({ type: 'int', nullable: true })
    maxUses: number

    @Column({ type: 'int', default: 0 })
    usedCount: number

    @Column({ type: 'boolean', default: true })
    isActive: boolean

    @ManyToOne(() => Workspace, (workspace) => workspace.joinLinks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workspaceId' })
    workspace: Workspace

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'createdBy' })
    creator: User

}