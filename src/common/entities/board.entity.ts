import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Workspace } from "./workspace.entity";
import { List } from "./list.entity";
import { BoardMember } from "./board-member.entity";

export enum BoardVisibility {
    PRIVATE = 'private',
    WORKSPACE = 'workspace',
    PUBLIC = 'public'
}
@Entity('boards')
export class Board extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    coverUrl: string;

    @Column({ type: 'enum', enum: BoardVisibility, default: BoardVisibility.WORKSPACE })
    visibility: BoardVisibility;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @ManyToOne(() => Workspace, (workspace) => workspace.boards, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workspaceId' })
    workspace: Workspace

    @OneToMany(() => BoardMember, (boardMember) => boardMember.board)
    boardMembers: BoardMember[]

    @OneToMany(() => List, (list) => list.board)
    lists: List[]
}