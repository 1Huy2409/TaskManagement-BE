import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Workspace } from "./workspace.entity";
import { DateTimeEntity } from "./base/date-time.entity";

export enum WorkspaceMemberRole {
    OWNER = 'owner',
    ADMIN = 'admin', // handle request from member, manage member's board
    MEMBER = 'member', // can edit and send propose
    VIEWER = 'viewer' // only view cant edit
}

@Entity('workspace-members')
export class WorkspaceMember extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'enum', enum: WorkspaceMemberRole, nullable: false, default: WorkspaceMemberRole.MEMBER })
    role: WorkspaceMemberRole

    @ManyToOne(() => User, (user) => user.workspaceMembers)
    user: User

    @ManyToOne(() => Workspace, (workspace) => workspace.workspaceMembers)
    workspace: Workspace

}