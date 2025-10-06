import { DataSource } from "typeorm";
import { User } from '../common/entities/user.entity';
import path from 'path';
import { Project } from "@/common/entities/project.entity";
import { ProjectMember } from "@/common/entities/project-member.entity";
import { List } from "@/common/entities/list.entity";
import { Comment } from "@/common/entities/comment.entity";
import { Notification } from "@/common/entities/notification.entity";
import { Card } from "@/common/entities/card.entity";
import { CardMember } from "@/common/entities/card-member.entity";
import { Board } from "@/common/entities/board.entity";
import { BoardMember } from "@/common/entities/board-member.entity";
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
    entities: [User, Project, ProjectMember, Notification, List, Comment, Card, CardMember, Board, BoardMember],
    migrations: [path.join(__dirname, '../common/migrations/*.{ts,js}')],
    migrationsRun: true
})