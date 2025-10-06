import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Board } from "./board.entity";
import { ProjectMember } from "./project-member.entity";

@Entity('projects')
export class Project extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    title: string

    @Column({ type: 'varchar', nullable: true })
    description: string

    @OneToMany(() => ProjectMember, (projectMember) => projectMember.project)
    projectMembers: ProjectMember[]

    @OneToMany(() => Board, (board) => board.project)
    boards: Board[]
}