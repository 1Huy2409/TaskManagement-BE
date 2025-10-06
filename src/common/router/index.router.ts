import express from 'express'
import type { Router } from 'express'
import { User } from '../entities/user.entity'
import UserController from '@/apis/user/user.controller'
import UserService from '@/apis/user/user.service'
import userRouter from '@/apis/user/user.router'
import healthCheckRouter from '@/apis/healthcheck/healthcheck.router'
import { AppDataSource } from '@/config/db.config'
import HealthCheckController from '@/apis/healthcheck/healthcheck.controller'
import AuthService from '@/apis/auth/auth.service'
import AuthController from '@/apis/auth/auth.controller'
import authRouter from '@/apis/auth/auth.router'

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
initHealthCheckModule();
initAuthModule();
initUserModule();
export default mainRouter;