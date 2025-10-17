import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';

export const AddBoardMemberSchema = z.object({
    userId: z.uuid().openapi({ description: 'ID of the user to be added', example: '123e4567-e89b-12d3-a456-426614174000' }),
    roleId: z.uuid().openapi({ example: '981e4557-e89b-12d3-a456-426614174000' })
})
export const UpdateBoardMemberRoleSchema = z.object({
    roleId: z.uuid().openapi({ example: '981e4557-e89b-12d3-a456-426614174000' })
})
export const PostBoardMemberRequest: ZodRequestBody = {
    description: 'Add a member to the board',
    content: {
        'application/json': {
            schema: AddBoardMemberSchema.openapi({ example: { userId: '123e4567-e89b-12d3-a456-426614174000', roleId: '981e4557-e89b-12d3-a456-426614174000' } })
        }
    }
}
export const PatchBoardMemberRequest: ZodRequestBody = {
    description: 'Update a member role in the board',
    content: {
        'application/json': {
            schema: UpdateBoardMemberRoleSchema.openapi({ example: { roleId: '981e4557-e89b-12d3-a456-426614174000' } })
        }
    }
}
export type AddBoardMemberSchema = z.infer<typeof AddBoardMemberSchema>;
export type UpdateBoardMemberRoleSchema = z.infer<typeof UpdateBoardMemberRoleSchema>;