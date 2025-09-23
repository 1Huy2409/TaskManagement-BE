import { DataSource } from "typeorm";
import { User } from '../common/entities/user.entity';
import path from 'path';
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres_password',
    database: process.env.POSTGRES_DB || 'postgres_database',
    connectTimeoutMS: 10000,
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: [path.join(__dirname, '../common/migrations/*.{ts,js}')],
    migrationsRun: true
})