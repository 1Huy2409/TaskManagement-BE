import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateWorkspaceRoleRequestSchema = z.object({
    name: z.string().min(1).max(100).openapi({
        example: 'custom_manager',
        description: 'Role name'
    }),
    description: z.string().optional().openapi({
        example: 'Custom manager role for workspace',
        description: 'Role description'
    }),
    permissions: z.array(z.string()).openapi({
        example: ['workspace:view', 'workspace:update', 'board:create'],
        description: 'Array of permission actions'
    })
});

export const UpdateWorkspaceRoleRequestSchema = z.object({
    name: z.string().min(1).max(100).optional().openapi({
        example: 'custom_manager',
        description: 'Role name'
    }),
    description: z.string().optional().openapi({
        example: 'Updated description',
        description: 'Role description'
    }),
    permissions: z.array(z.string()).optional().openapi({
        example: ['workspace:view', 'workspace:update', 'board:view'],
        description: 'Array of permission actions'
    })
});

export const PostWorkspaceRoleRequest: ZodRequestBody = {
    description: 'Create new workspace role',
    content: {
        'application/json': {
            schema: CreateWorkspaceRoleRequestSchema
        }
    }
};

export const PatchWorkspaceRoleRequest: ZodRequestBody = {
    description: 'Update workspace role',
    content: {
        'application/json': {
            schema: UpdateWorkspaceRoleRequestSchema
        }
    }
};

export type CreateWorkspaceRoleRequest = z.infer<typeof CreateWorkspaceRoleRequestSchema>;
export type UpdateWorkspaceRoleRequest = z.infer<typeof UpdateWorkspaceRoleRequestSchema>;
