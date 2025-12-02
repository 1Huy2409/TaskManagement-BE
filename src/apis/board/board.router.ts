import { z } from "zod";
import { Router } from "express";
import BoardController from "./board.controller";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { BoardResponseSchema, ListBoardResponseSchema } from "./schemas";
import { createApiResponse } from '@/api-docs/openAPIResponseBuilder';
import { checkAuthentication } from "@/common/middleware/authentication";
import { checkBoardPermission, checkWorkspacePermission } from "@/common/middleware/authorization";
import { PERMISSIONS } from "@/common/constants/permissions";
export const boardRegistry = new OpenAPIRegistry()
boardRegistry.register('Board', BoardResponseSchema)
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

    boardRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/boards/{id}',
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
        responses: createApiResponse(z.null(), 'Success')
    })
    router.delete('/:id',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_DELETE)),
        asyncHandler(boardController.deleteBoard))
    // reopen archived board
    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/{id}/reopen',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid() })
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.post('/:id/reopen',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_UPDATE)),
        asyncHandler(boardController.reopenBoard))

    // permanent delete
    boardRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/boards/{id}/permanent',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid() })
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.delete('/:id/permanent',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_DELETE)),
        asyncHandler(boardController.deletePermanent))

    // change owner
    const ChangeOwnerBody = z.object({ ownerId: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }) });
    boardRegistry.registerPath({
        method: 'post',
        path: '/api/v1/boards/{id}/change-owner',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.uuid() }),
            body: ChangeOwnerBody
        },
        responses: createApiResponse(BoardResponseSchema, 'Success')
    })
    router.post('/:id/change-owner',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_UPDATE)),
        asyncHandler(boardController.changeOwner))
    return router;
}