import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DateTimeEntity } from "./base/date-time.entity";
import { Board } from "./board.entity";
import { User } from "./user.entity";

@Entity('board-join-links')
export class BoardJoinLink extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'uuid' })
    boardId: string

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

    @ManyToOne(() => Board, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'boardId' })
    board: Board

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'createdBy' })
    creator: User
}
