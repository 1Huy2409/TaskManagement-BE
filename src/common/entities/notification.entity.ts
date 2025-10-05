import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { DateTimeEntity } from "./base/date-time.entity";

@Entity('notifications')
export class Notification extends DateTimeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'text' })
    message: string;

    @Column({ type: 'enum', enum: ['info', 'warning', 'error'], default: 'info' })
    type: string;

    @Column({ type: 'json', nullable: true })
    data: any;

    @Column({ name: 'isRead', type: 'boolean', default: false })
    isRead: boolean;

    @ManyToOne(() => User, (user) => user.notifications)
    user: User
}