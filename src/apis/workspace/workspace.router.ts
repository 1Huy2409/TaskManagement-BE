import { Router } from "express";
import WorkspaceController from "./workspace.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { ListWorkspaceResponseSchema, PatchWorkspaceMemberRoleRequest, PatchWorkspaceRequest, PostWorkspaceMemberRequest, PostWorkspaceRequest, WorkspaceMemberResponseSchema, WorkspaceResponseSchema } from "./schemas";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import passports from "passport";
import { z } from 'zod'
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import { BoardResponseSchema, ListBoardResponseSchema, PatchBoardRequest, PostBoardRequest } from "../board/schemas";
export const workspaceRegistry = new OpenAPIRegistry()
workspaceRegistry.register('Workspace', WorkspaceResponseSchema)
workspaceRegistry.registerComponent('securitySchemes', 'bearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
})
// add more schemas here
// register your schemas here
export default function workspaceRouter(workspaceController: WorkspaceController): Router {
    const router: Router = Router();

    workspaceRegistry.registerPath({
        method: 'get',
        path: '/api/v1/workspaces',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        responses: createApiResponse(ListWorkspaceResponseSchema, 'Success')
    })
    router.get('/',
        passports.authenticate('jwt', { session: false }),
        asyncHandler(workspaceController.findAll)
    )

    workspaceRegistry.registerPath({
        method: 'get',
        path: '/api/v1/workspaces/{id}',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(ListWorkspaceResponseSchema, 'Success')
    })
    router.get('/:id',
        passports.authenticate('jwt', { session: false }),
        asyncHandler(workspaceController.findById)
    )

    workspaceRegistry.registerPath({
        method: 'post',
        path: '/api/v1/workspaces',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: { body: PostWorkspaceRequest },
        responses: createApiResponse(WorkspaceResponseSchema, 'Success'),
    })
    router.post('/',
        passports.authenticate('jwt', { session: false }),
        asyncHandler(workspaceController.create)
    )

    workspaceRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/workspaces/{id}',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                })
            }),
            body: PatchWorkspaceRequest
        },
        responses: createApiResponse(WorkspaceResponseSchema, 'Success'),
    })
    router.patch('/:id',
        passports.authenticate('jwt', { session: false }),
        asyncHandler(workspaceController.update)
    )
    // router delete workspace
    workspaceRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/workspaces/{id}',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(WorkspaceResponseSchema, 'Success'),
    })
    router.delete('/:id',
        passports.authenticate('jwt', { session: false }),
        asyncHandler(workspaceController.delete)
    )









    // manage members in workspace
    workspaceRegistry.registerPath({
        method: 'get',
        path: '/api/v1/workspaces/{id}/members',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(ListWorkspaceResponseSchema, 'Success')
    })
    router.get('/:id/members',
        passports.authenticate('jwt', { session: false }),
        asyncHandler(workspaceController.getWorkspaceMembers)
    )

    workspaceRegistry.registerPath({
        method: 'post',
        path: '/api/v1/workspaces/{id}/members',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                })
            }),
            body: PostWorkspaceMemberRequest
        },
        responses: createApiResponse(WorkspaceMemberResponseSchema, 'Success')
    })
    router.post('/:id/members',
        passports.authenticate('jwt', { session: false }),
        asyncHandler(workspaceController.addMemberToWorkspace)
    )

    workspaceRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/workspaces/{id}/members/{userId}',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                }),
                userId: z.uuid().openapi({
                    example: 'b9860e3c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                }),
            }),
            body: PatchWorkspaceMemberRoleRequest
        },
        responses: createApiResponse(WorkspaceMemberResponseSchema, 'Success')
    })
    router.patch('/:id/members/:userId',
        passports.authenticate('jwt', { session: false }),
        asyncHandler(workspaceController.updateMemberRole)
    )

    workspaceRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/workspaces/{id}/members/{userId}',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                }),
                userId: z.uuid().openapi({
                    example: 'b9860e3c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'User UUID',
                    format: 'uuid'
                }),
            })
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.delete('/:id/members/:userId',
        passports.authenticate('jwt', { session: false }),
        asyncHandler(workspaceController.removeMemberFromWorkspace)
    )

    // manage workspace's boards
    workspaceRegistry.registerPath({
        method: 'get',
        path: '/api/v1/workspaces/{id}/boards',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(ListBoardResponseSchema, 'Success')
    })
    router.get('/:id/boards', asyncHandler(workspaceController.getAllBoardFromWorkspace))

    workspaceRegistry.registerPath({
        method: 'post',
        path: '/api/v1/workspaces/{id}/boards',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                })
            }),
            body: PostBoardRequest
        },
        responses: createApiResponse(BoardResponseSchema, 'Success')
    })
    router.post('/:id/boards', asyncHandler(workspaceController.addBoardToWorkspace))

    workspaceRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/workspaces/{id}/boards/{boardId}',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                }),
                boardId: z.uuid().openapi({
                    example: 'b9860e3c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                }),
            }),
            body: PatchBoardRequest
        },
        responses: createApiResponse(WorkspaceMemberResponseSchema, 'Success')
    })
    router.patch('/:id/boards/:boardId', asyncHandler(workspaceController.updateBoardInWorkspace))

    workspaceRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/workspaces/{id}/boards/{boardId}',
        tags: ['Board'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                }),
                boardId: z.uuid().openapi({
                    example: 'b9860e3c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Board UUID',
                    format: 'uuid'
                }),
            })
        },
        responses: createApiResponse(z.null(), 'Success')
    })
    router.delete('/:id/boards/:boardId', asyncHandler(workspaceController.deleteBoardInWorkspace))
    return router
}