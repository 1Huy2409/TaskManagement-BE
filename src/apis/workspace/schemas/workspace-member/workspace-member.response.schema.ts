import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);
export const WorkspaceMemberResponseSchema = z.object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    userId: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    fullname: z.string().openapi({ example: 'John Doe' }),
    workspaceId: z.uuid().optional().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    roleName: z.string().openapi({ example: 'workspace.admin' }),
    created_at: z.date().optional(),
    updated_at: z.date().optional()
})
export const ListWorkspaceMemberResponseSchema = z.array(WorkspaceMemberResponseSchema);
export type ListWorkspaceMemberResponse = z.infer<typeof ListWorkspaceMemberResponseSchema>;
export type WorkspaceMemberResponse = z.infer<typeof WorkspaceMemberResponseSchema>;