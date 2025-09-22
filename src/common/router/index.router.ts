import express from 'express'
import type { Router } from 'express'
import { User } from '../entities/user.entity.js'
import UserController from '@/apis/user/user.controller.js'
import UserService from '@/apis/user/user.service.js'
import userRouter from '@/apis/user/user.router.js'
import healthCheckRouter from '@/apis/healthcheck/healthcheck.router.js'
import { AppDataSource } from '@/config/db.config.js'
import HealthCheckController from '@/apis/healthcheck/healthCheck.controller.js'

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