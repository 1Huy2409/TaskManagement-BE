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

const mainRouter: Router = express.Router()
const initHealthCheckModule = () => {
    const healthCheckController = new HealthCheckController();
    mainRouter.use('/health-check', healthCheckRouter(healthCheckController))
}
const initUserModule = () => {
    const userRepository = AppDataSource.getRepository(User);
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);

    mainRouter.use('/users', userRouter(userController));
}
const initAuthModule = () => {
    const userRepository = AppDataSource.getRepository(User);
    const authService = new AuthService(userRepository);
    const authController = new AuthController(authService);

    mainRouter.use('/auth', authRouter(authController))
}
const initWorkspaceModule = () => {
    const workspaceRepository = AppDataSource.getRepository(Workspace);
    const workspaceMemberRepository = AppDataSource.getRepository(WorkspaceMember);
    const workspaceService = new WorkspaceService(workspaceRepository, workspaceMemberRepository);
    const workspaceController = new WorkspaceController(workspaceService);

    mainRouter.use('/workspaces', workspaceRouter(workspaceController));
}
initHealthCheckModule();
initAuthModule();
initUserModule();
initWorkspaceModule();
export default mainRouter;