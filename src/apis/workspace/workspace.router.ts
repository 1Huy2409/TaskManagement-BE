import { Router } from "express";
import WorkspaceController from "./workspace.controller";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { ListWorkspaceResponseSchema, PatchWorkspaceMemberRoleRequest, PatchWorkspaceRequest, PostWorkspaceMemberRequest, PostWorkspaceRequest, WorkspaceMemberResponseSchema, WorkspaceResponseSchema, PostWorkspaceRoleRequest, PatchWorkspaceRoleRequest, WorkspaceRoleResponseSchema, ListWorkspaceRoleResponseSchema } from "./schemas";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { z } from 'zod'
import { createApiResponse } from "@/api-docs/openAPIResponseBuilder";
import { BoardResponseSchema, ListBoardResponseSchema, PatchBoardRequest, PostBoardRequest } from "../board/schemas";
import { PERMISSIONS } from "@/common/constants/permissions";
import { checkBoardPermission, checkWorkspacePermission } from "@/common/middleware/authorization";
import { checkAuthentication } from "@/common/middleware/authentication";
import { performanceLogger } from "@/common/middleware/performanceLogger";

export const workspaceRegistry = new OpenAPIRegistry()
workspaceRegistry.register('Workspace', WorkspaceResponseSchema)

export default function workspaceRouter(workspaceController: WorkspaceController): Router {
    const router: Router = Router();

    workspaceRegistry.registerPath({
        method: 'get',
        path: '/api/v1/workspaces',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                name: 'status',
                in: 'query',
                required: false,
                schema: {
                    type: 'string',
                    enum: ['active', 'archived']
                },
                description: 'Filter workspace by status'
            }
        ],
        responses: createApiResponse(ListWorkspaceResponseSchema, 'Success')
    });

    router.get('/',
        asyncHandler(checkAuthentication),
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
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_VIEW)),
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
        asyncHandler(checkAuthentication),
        asyncHandler(workspaceController.create)
    )

    workspaceRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/workspaces/{id}/archive',
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
        },
        responses: createApiResponse(z.object({
            message: z.string(),
            workspace: WorkspaceResponseSchema
        }), 'Success'),
    })
    router.patch('/:id/archive',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_UPDATE)),
        asyncHandler(workspaceController.archive)
    )
    workspaceRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/workspaces/{id}/reopen',
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
        },
        responses: createApiResponse(z.object({
            message: z.string(),
            workspace: WorkspaceResponseSchema
        }), 'Success'),
    })
    router.patch('/:id/reopen',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_UPDATE)),
        asyncHandler(workspaceController.reopen)
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
        performanceLogger('PATCH /api/v1/workspaces/:id'),
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_UPDATE)),
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
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_DELETE)),
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
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_VIEW_MEMBERS)),
        asyncHandler(workspaceController.getWorkspaceMembers)
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
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_MEMBERS)),
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
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_MEMBERS)),
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
    router.get('/:id/boards',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.BOARD_VIEW)),
        asyncHandler(workspaceController.getAllBoardFromWorkspace))

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
    router.post('/:id/boards',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.BOARD_CREATE)),
        asyncHandler(workspaceController.addBoardToWorkspace))

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
    router.patch('/:id/boards/:boardId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_UPDATE)),
        asyncHandler(workspaceController.updateBoardInWorkspace))

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
    router.delete('/:id/boards/:boardId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkBoardPermission(PERMISSIONS.BOARD_DELETE)),
        asyncHandler(workspaceController.deleteBoardInWorkspace))

    // manage workspace roles
    workspaceRegistry.registerPath({
        method: 'get',
        path: '/api/v1/workspaces/{id}/roles',
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
        responses: createApiResponse(ListWorkspaceRoleResponseSchema, 'Success')
    })
    router.get('/:id/roles',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_ROLES)),
        asyncHandler(workspaceController.getWorkspaceRoles)
    )

    workspaceRegistry.registerPath({
        method: 'post',
        path: '/api/v1/workspaces/{id}/roles',
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
            body: PostWorkspaceRoleRequest
        },
        responses: createApiResponse(WorkspaceRoleResponseSchema, 'Success')
    })
    router.post('/:id/roles',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_ROLES)),
        asyncHandler(workspaceController.addWorkspaceRole)
    )

    workspaceRegistry.registerPath({
        method: 'patch',
        path: '/api/v1/workspaces/{id}/roles/{roleId}',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                }),
                roleId: z.uuid().openapi({
                    example: 'c3d4e5f6-7g8h-9i0j-1k2l-m3n4o5p6q7r8',
                    description: 'Role UUID',
                    format: 'uuid'
                })
            }),
            body: PatchWorkspaceRoleRequest
        },
        responses: createApiResponse(WorkspaceRoleResponseSchema, 'Success')
    })
    router.patch('/:id/roles/:roleId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_ROLES)),
        asyncHandler(workspaceController.updateWorkspaceRole)
    )

    workspaceRegistry.registerPath({
        method: 'delete',
        path: '/api/v1/workspaces/{id}/roles/{roleId}',
        tags: ['Workspace'],
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({
                id: z.uuid().openapi({
                    example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                    description: 'Workspace UUID',
                    format: 'uuid'
                }),
                roleId: z.uuid().openapi({
                    example: 'c3d4e5f6-7g8h-9i0j-1k2l-m3n4o5p6q7r8',
                    description: 'Role UUID',
                    format: 'uuid'
                })
            })
        },
        responses: createApiResponse(z.object({
            message: z.string()
        }), 'Success')
    })
    router.delete('/:id/roles/:roleId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_ROLES)),
        asyncHandler(workspaceController.deleteWorkspaceRole)
    )
    return router
}