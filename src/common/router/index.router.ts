import express from 'express'
import type { Router } from 'express'
import { User } from '../entities/user.entity'
import { Workspace } from '../entities/workspace.entity'
import UserController from '@/apis/user/user.controller'
import UserService from '@/apis/user/user.service'
import userRouter from '@/apis/user/user.router'
import healthCheckRouter from '@/apis/healthcheck/healthcheck.router'
import { AppDataSource } from '@/config/db.config'
import HealthCheckController from '@/apis/healthcheck/healthcheck.controller'
import AuthService from '@/apis/auth/auth.service'
import AuthController from '@/apis/auth/auth.controller'
import authRouter from '@/apis/auth/auth.router'
import WorkspaceService from '@/apis/workspace/workspace.service'
import WorkspaceController from '@/apis/workspace/workspace.controller'
import workspaceRouter from '@/apis/workspace/workspace.router'
import { WorkspaceMember } from '../entities/workspace-member.entity'
import { Board } from '../entities/board.entity'
import { BoardMember } from '../entities/board-member.entity'
import BoardService from '@/apis/board/board.service'
import BoardController from '@/apis/board/board.controller'
import boardRouter from '@/apis/board/board.router'
import { Role } from '../entities/role.entity'
import { Otp } from '../entities/otp.entity'
import { UserRepository } from '@/apis/user/repositories/user.repository'
import { WorkspaceRepository } from '@/apis/workspace/repositories/workspace.repository'
import { WorkspaceMemberRepository } from '@/apis/workspace/repositories/workspace-member.repository'
import { BoardRepository } from '@/apis/board/repositories/board.repository'
import { RoleRepository } from '@/apis/role/repositories/role.repository'

const mainRouter: Router = express.Router()
const initHealthCheckModule = () => {
    const healthCheckController = new HealthCheckController();
    mainRouter.use('/health-check', healthCheckRouter(healthCheckController))
}
const initUserModule = () => {
    const userOrmRepo = AppDataSource.getRepository(User);
    const userRepository = new UserRepository(userOrmRepo)
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    mainRouter.use('/users', userRouter(userController));
}
// need fix
const initAuthModule = () => {
    const userRepository = AppDataSource.getRepository(User);
    const otpRepository = AppDataSource.getRepository(Otp);
    const authService = new AuthService(userRepository, otpRepository);
    const authController = new AuthController(authService);

    mainRouter.use('/auth', authRouter(authController))
}

const initWorkspaceModule = () => {
    const workspaceOrmRepo = AppDataSource.getRepository(Workspace);
    const workspaceRepository = new WorkspaceRepository(workspaceOrmRepo);
    const workspaceMemberOrmRepo = AppDataSource.getRepository(WorkspaceMember);
    const workspaceMemberRepository = new WorkspaceMemberRepository(workspaceMemberOrmRepo);
    const boardOrmRepo = AppDataSource.getRepository(Board);
    const boardRepository = new BoardRepository(boardOrmRepo);
    const roleOrmRepo = AppDataSource.getRepository(Role);
    const roleRepository = new RoleRepository(roleOrmRepo);
    const workspaceService = new WorkspaceService(workspaceRepository, workspaceMemberRepository, boardRepository, roleRepository);
    const workspaceController = new WorkspaceController(workspaceService);

    mainRouter.use('/workspaces', workspaceRouter(workspaceController));
}
const initBoardModule = () => {
    const boardOrmRepo = AppDataSource.getRepository(Board);
    const boardRepository = new BoardRepository(boardOrmRepo);
    const boardService = new BoardService(boardRepository);
    const boardController = new BoardController(boardService);

    mainRouter.use('/boards', boardRouter(boardController))
}
initHealthCheckModule();
initAuthModule();
initUserModule();
initWorkspaceModule();
initBoardModule();
export default mainRouter;