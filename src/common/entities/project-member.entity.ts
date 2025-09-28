import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Project } from "./project.entity";
import { DateTimeEntity } from "./base/date-time.entity";

export enum ProjectMemberRole {
    OWNER = 'owner',
    ADMIN = 'admin', // handle request from member, manage member's board
    MEMBER = 'member', // can edit and send propose
    VIEWER = 'viewer' // only view cant edit
}

@Entity('project-members')
export class ProjectMember extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'enum', enum: ProjectMemberRole, nullable: false, default: ProjectMemberRole.MEMBER })
    role: ProjectMemberRole

    @ManyToOne(() => User, (user) => user.projectMembers)
    user: User

    @ManyToOne(() => Project, (project) => project.projectMembers)
    project: Project

}