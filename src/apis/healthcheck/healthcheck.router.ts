import express from 'express';
import { unknown, z } from 'zod'
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { Router, Request, Response } from 'express';
import { createApiResponse } from '@/api-docs/openAPIResponseBuilder.js';
import HealthCheckController from './healthcheck.controller';

export const healthCheckRegistry = new OpenAPIRegistry();
export default function healthCheckRouter(controller: HealthCheckController): Router {
    const router: Router = express.Router();

    healthCheckRegistry.registerPath({
        method: 'get',
        path: '/api/v1/health-check',
        tags: ['Health Check'],
        responses: createApiResponse(z.null(), 'Success')
    })
    router.get('/', controller.healthCheck)
    return router;
}