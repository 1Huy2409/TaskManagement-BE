import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { WorkspaceStatus } from '@/common/entities/workspace.entity';

extendZodWithOpenApi(z);

export const CreateWorkspaceSchema = z.object({
    title: z.string().min(1).max(100).openapi({ description: 'Title of the workspace', example: 'My Workspace' }),
    description: z.string().max(500).optional().openapi({ description: 'Description of the workspace', example: 'This is my workspace' }),
    visibility: z.boolean().optional().default(true).openapi({ description: 'Whether the workspace is private', example: false }),
})

export const PostWorkspaceRequest: ZodRequestBody = {
    description: 'Create new workspace',
    content: {
        'application/json': {
            schema: CreateWorkspaceSchema.openapi({ example: { title: 'My Workspace', description: 'This is my workspace', visibility: false } })
        }
    }
}

export const UpdateWorkspaceSchema = z.object({
    title: z.string().min(1).max(100).optional().openapi({ description: 'Title of the workspace', example: 'My Updated Workspace' }),
    description: z.string().max(500).optional().openapi({ description: 'Description of the workspace', example: 'This is my updated workspace' }),
    visibility: z.boolean().optional().openapi({ description: 'Whether the workspace is private', example: true }),
})

export const PatchWorkspaceRequest: ZodRequestBody = {
    description: 'Update workspace',
    content: {
        'application/json': {
            schema: UpdateWorkspaceSchema.openapi({ example: { title: 'My Updated Workspace', description: 'This is my updated workspace', visibility: true } })
        }
    }
}
export type CreateWorkspaceSchema = z.infer<typeof CreateWorkspaceSchema>;
export type UpdateWorkspaceSchema = z.infer<typeof UpdateWorkspaceSchema>;
export type PostWorkspaceRequest = z.infer<typeof CreateWorkspaceSchema>;
export type PatchWorkspaceRequest = z.infer<typeof UpdateWorkspaceSchema>;