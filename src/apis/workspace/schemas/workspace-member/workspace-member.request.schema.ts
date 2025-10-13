import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { WorkspaceMemberRole } from '@/common/entities/workspace-member.entity';
extendZodWithOpenApi(z);

export const AddWorkspaceMemberSchema = z.object({
    userId: z.uuid().openapi({ description: 'ID of the user to be added', example: '123e4567-e89b-12d3-a456-426614174000' }),
    role: z.enum(WorkspaceMemberRole).openapi({ description: 'Role of the user in the workspace', example: WorkspaceMemberRole.MEMBER }),
});

export const UpdateWorkspaceMemberRoleSchema = z.object({
    role: z.enum(WorkspaceMemberRole).openapi({ description: 'New role of the user in the workspace', example: WorkspaceMemberRole.ADMIN }),
});

export const PostWorkspaceMemberRequest: ZodRequestBody = {
    description: 'Add a member to the workspace',
    content: {
        'application/json': {
            schema: AddWorkspaceMemberSchema.openapi({ example: { userId: '123e4567-e89b-12d3-a456-426614174000', role: WorkspaceMemberRole.MEMBER } })
        }
    }
}
export const PatchWorkspaceMemberRoleRequest: ZodRequestBody = {
    description: 'Update a member role in the workspace',
    content: {
        'application/json': {
            schema: UpdateWorkspaceMemberRoleSchema.openapi({ example: { role: WorkspaceMemberRole.ADMIN } })
        }
    }
}
export type AddWorkspaceMemberSchema = z.infer<typeof AddWorkspaceMemberSchema>;
export type UpdateWorkspaceMemberRoleSchema = z.infer<typeof UpdateWorkspaceMemberRoleSchema>;