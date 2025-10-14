import { z } from "zod";
import { Router } from "express";
import BoardController from "./board.controller";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { BoardResponseSchema, ListBoardResponseSchema } from "./schemas";
import { createApiResponse } from '@/api-docs/openAPIResponseBuilder';
export const boardRegistry = new OpenAPIRegistry()
boardRegistry.register('Board', BoardResponseSchema)
boardRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
})
export default function boardRouter(boardController: BoardController): Router {
    const router: Router = Router()

    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/public',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        responses: createApiResponse(ListBoardResponseSchema, 'Success')
    })
    router.get('/public', asyncHandler(boardController.getAllPublicBoards))
    boardRegistry.registerPath({
        method: 'get',
        path: '/api/v1/boards/public/{id}',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(ListBoardResponseSchema, 'Success')
    })
    router.get('/public/:id', asyncHandler(boardController.getPublicBoardById))
    return router;
}