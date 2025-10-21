import { DataSource } from "typeorm";
import { User } from '../common/entities/user.entity';
import path from 'path';
import { Workspace } from "../common/entities/workspace.entity";
import { WorkspaceMember } from "../common/entities/workspace-member.entity";
import { List } from "../common/entities/list.entity";
import { Comment } from "../common/entities/comment.entity";
import { Notification } from "../common/entities/notification.entity";
import { Card } from "../common/entities/card.entity";
import { CardMember } from "../common/entities/card-member.entity";
import { Board } from "../common/entities/board.entity";
import { BoardMember } from "../common/entities/board-member.entity";
import { Role } from "../common/entities/role.entity";
import { Permission } from "../common/entities/permission.entity";
import { RolePermission } from "../common/entities/role-permission.entity";
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres_password',
    database: process.env.POSTGRES_DB || 'postgres_database',
    connectTimeoutMS: 10000,
    synchronize: false,
    logging: true,
    entities: [User, Workspace, WorkspaceMember, Notification, List, Comment, Card, CardMember, Board, BoardMember, Role, Permission, RolePermission],
    migrations: [path.join(__dirname, '../common/migrations/*.{ts,js}')],
    migrationsRun: false
})