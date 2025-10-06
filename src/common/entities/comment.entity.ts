import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { DateTimeEntity } from "./base/date-time.entity";
import { Card } from "./card.entity";

@Entity('comments')
export class Comment extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string

    @Column({ type: 'text' })
    content: string

    @ManyToOne(() => Card, (card) => card.comments)
    card: Card

    @ManyToOne(() => User, (user) => user.comments)
    user: User
}