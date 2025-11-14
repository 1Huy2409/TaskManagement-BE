import { JoinLinkResponse, JoinLinkResponseSchema, PostJoinLinkRequest, PostJoinWorkspaceByLinkRequest } from './schemas/join-link.schema';
import { z } from 'zod';
import { Router } from "express";
import { JoinLinkController } from "./join-link.controller";
import { asyncHandler } from "@/common/middleware/asyncHandler";
import { checkAuthentication } from "@/common/middleware/authentication";
import { checkWorkspacePermission } from "@/common/middleware/authorization";
import { PERMISSIONS } from "@/common/constants/permissions";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { createApiResponse } from '@/api-docs/openAPIResponseBuilder';

export const joinLinkRegistry = new OpenAPIRegistry();
joinLinkRegistry.register('Create Join Link', z.null());
export default function joinLinkRouter(joinLinkController: JoinLinkController): Router {
    const router: Router = Router();

    joinLinkRegistry.registerPath(
        {
            method: 'post',
            path: '/api/v1/workspaces/{id}/join-links',
            tags: ['Join Link'],
            security: [{ bearerAuth: [] }],
            request: {
                params: z.object({
                    id: z.uuid().openapi({
                        example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                        description: 'Workspace UUID',
                        format: 'uuid'
                    })
                }),
                body: PostJoinLinkRequest
            },
            responses: createApiResponse(JoinLinkResponseSchema, 'Success')
        }
    )
    router.post('/:id/join-links',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_MEMBERS)),
        asyncHandler(joinLinkController.createJoinLink)
    )

    joinLinkRegistry.registerPath(
        {
            method: 'post',
            path: '/api/v1/workspaces/join-by-link',
            tags: ['Join Link'],
            security: [{ bearerAuth: [] }],
            request: {
                body: PostJoinWorkspaceByLinkRequest
            },
            responses: createApiResponse(JoinLinkResponseSchema, 'Success')
        }
    )
    router.post('/join-by-link',
        asyncHandler(checkAuthentication),
        asyncHandler(joinLinkController.joinByLink)
    )

    joinLinkRegistry.registerPath(
        {
            method: 'get',
            path: '/api/v1/workspaces/{id}/join-links',
            tags: ['Join Link'],
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
            responses: createApiResponse(z.array(JoinLinkResponseSchema), 'Success')
        }
    )
    router.get('/:id/join-links',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_MEMBERS)),
        asyncHandler(joinLinkController.getWorkspaceJoinLinks)
    )

    joinLinkRegistry.registerPath(
        {
            method: 'patch',
            path: '/api/v1/workspaces/{workspaceId}/join-links/{linkId}/revoke',
            tags: ['Join Link'],
            security: [{ bearerAuth: [] }],
            request: {
                params: z.object({
                    workspaceId: z.uuid().openapi({
                        example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                        description: 'Workspace UUID',
                        format: 'uuid'
                    }),
                    linkId: z.uuid().openapi({
                        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                        description: 'Join Link UUID',
                        format: 'uuid'
                    })
                })
            },
            responses: createApiResponse(JoinLinkResponseSchema, 'Success')
        }
    )
    router.patch('/:workspaceId/join-links/:linkId/revoke',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_MEMBERS)),
        asyncHandler(joinLinkController.revokeJoinLink)
    )

    joinLinkRegistry.registerPath(
        {
            method: 'delete',
            path: '/api/v1/workspaces/{workspaceId}/join-links/{linkId}',
            tags: ['Join Link'],
            security: [{ bearerAuth: [] }],
            request: {
                params: z.object({
                    workspaceId: z.uuid().openapi({
                        example: 'b9860e4c-5ba0-4715-b483-87fc69bfc6ef',
                        description: 'Workspace UUID',
                        format: 'uuid'
                    }),
                    linkId: z.uuid().openapi({
                        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
                        description: 'Join Link UUID',
                        format: 'uuid'
                    })
                })
            },
            responses: createApiResponse(JoinLinkResponseSchema, 'Success')
        }
    )
    router.delete('/:workspaceId/join-links/:linkId',
        asyncHandler(checkAuthentication),
        asyncHandler(checkWorkspacePermission(PERMISSIONS.WORKSPACE_MANAGE_MEMBERS)),
        asyncHandler(joinLinkController.deleteJoinLink)
    )
    return router;
}