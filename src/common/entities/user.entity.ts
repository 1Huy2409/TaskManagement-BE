import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { Notification } from "./notification.entity";
import { DateTimeEntity } from "./base/date-time.entity";
import { WorkspaceMember } from "./workspace-member.entity";
import { BoardMember } from "./board-member.entity";
import { CardMember } from "./card-member.entity";

@Entity("users")
export class User extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar', length: 255 })
    fullname: string

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string

    @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
    googleId: string

    @Column({ type: 'varchar', length: 255 })
    password: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    avatarUrl: string

    @Column({ type: 'boolean', nullable: false, default: true })
    isActive: boolean

    @Column({ type: 'boolean', nullable: false, default: false })
    isVerified: boolean

    @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.user)
    workspaceMembers: WorkspaceMember[]

    @OneToMany(() => BoardMember, (boardMember) => boardMember.user)
    boardMembers: BoardMember[]

    @OneToMany(() => CardMember, (cardMember) => cardMember.user)
    cardMembers: CardMember[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[]
}