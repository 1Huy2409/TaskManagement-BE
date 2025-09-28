import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export class DateTimeEntity {
    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date
}