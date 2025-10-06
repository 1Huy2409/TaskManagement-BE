import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Project } from "./project.entity";
import { List } from "./list.entity";
import { BoardMember } from "./board-member.entity";


@Entity('boards')
export class Board extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    public title: string;

    @Column({ type: 'text', nullable: true })
    public description: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    public coverUrl: string;

    @ManyToOne(() => Project, (project) => project.boards, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project

    @OneToMany(() => BoardMember, (boardMember) => boardMember.board)
    boardMembers: BoardMember[]

    @OneToMany(() => List, (list) => list.board)
    lists: List[]
}