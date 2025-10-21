import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Board } from "./board.entity";
import { WorkspaceMember } from "./workspace-member.entity";
import { User } from "./user.entity";

@Entity('workspaces')
export class Workspace extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    title: string

    @Column({ type: 'varchar', nullable: true })
    description: string

    @Column({ type: 'boolean', default: false })
    visibility: boolean

    @Column({ type: 'boolean', default: true })
    isActive: boolean

    @Column({ type: 'uuid' })
    ownerId: string

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ownerId' })
    owner: User

    @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.workspace)
    workspaceMembers: WorkspaceMember[]

    @OneToMany(() => Board, (board) => board.workspace)
    boards: Board[]
}