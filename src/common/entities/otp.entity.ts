import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('otps')
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    email: string;

    @Column({ type: 'varchar', length: 10 })
    otp: string;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column()
    expiresAt: Date;
}