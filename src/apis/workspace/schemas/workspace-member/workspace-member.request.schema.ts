import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { RoleResponseSchema } from '@/apis/role/schemas';
extendZodWithOpenApi(z);

export const AddWorkspaceMemberSchema = z.object({
    userId: z.uuid().openapi({ description: 'ID of the user to be added', example: '123e4567-e89b-12d3-a456-426614174000' }),
    roleId: z.uuid().openapi({ description: '981e4557-e89b-12d3-a456-426614174000' })
});

export const UpdateWorkspaceMemberRoleSchema = z.object({
    roleId: z.uuid().openapi({ description: '981e4557-e89b-12d3-a456-426614174000' })
});

export const PostWorkspaceMemberRequest: ZodRequestBody = {
    description: 'Add a member to the workspace',
    content: {
        'application/json': {
            schema: AddWorkspaceMemberSchema.openapi({ example: { userId: '123e4567-e89b-12d3-a456-426614174000', roleId: '981e4557-e89b-12d3-a456-426614174000' } })
        }
    }
}
export const PatchWorkspaceMemberRoleRequest: ZodRequestBody = {
    description: 'Update a member role in the workspace',
    content: {
        'application/json': {
            schema: UpdateWorkspaceMemberRoleSchema.openapi({ example: { roleId: '981e4557-e89b-12d3-a456-426614174000' } })
        }
    }
}
export type AddWorkspaceMemberSchema = z.infer<typeof AddWorkspaceMemberSchema>;
export type UpdateWorkspaceMemberRoleSchema = z.infer<typeof UpdateWorkspaceMemberRoleSchema>;