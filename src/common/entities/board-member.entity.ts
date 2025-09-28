import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Board } from "./board.entity";
import { DateTimeEntity } from "./base/date-time.entity";
export enum BoardMemberRole {
    OWNER = 'owner',
    ADMIN = 'admin', // handle request from member, manage member's board
    MEMBER = 'member', // can edit and send propose
    VIEWER = 'viewer' // only view cant edit
}

@Entity('board-members')
export class BoardMember extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'enum', enum: BoardMemberRole, nullable: false, default: BoardMemberRole.MEMBER })
    role: BoardMemberRole

    @ManyToOne(() => User, (user) => user.boardMembers)
    user: User

    @ManyToOne(() => Board, (board) => board.boardMembers)
    board: Board
}