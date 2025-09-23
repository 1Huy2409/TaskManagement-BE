import express from 'express'
import type { Router } from 'express'
import { User } from '../entities/user.entity'
import UserController from '@/apis/user/user.controller'
import UserService from '@/apis/user/user.service'
import userRouter from '@/apis/user/user.router'
import healthCheckRouter from '@/apis/healthcheck/healthcheck.router'
import { AppDataSource } from '@/config/db.config'
import HealthCheckController from '@/apis/healthcheck/healthcheck.controller'

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
initHealthCheckModule();
initUserModule();
export default mainRouter;