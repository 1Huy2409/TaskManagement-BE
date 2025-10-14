import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { BoardMemberRole } from '@/common/entities/board-member.entity';

export const AddBoardMemberSchema = z.object({
    userId: z.uuid().openapi({ description: 'ID of the user to be added', example: '123e4567-e89b-12d3-a456-426614174000' }),
    role: z.enum(BoardMemberRole).openapi({ example: BoardMemberRole.MEMBER, description: 'Role of the user in the board' }),
})
export const UpdateBoardMemberRoleSchema = z.object({
    role: z.enum(BoardMemberRole).openapi({ example: BoardMemberRole.MEMBER, description: 'Role of the user in the board' }),
})
export const PostBoardMemberRequest: ZodRequestBody = {
    description: 'Add a member to the board',
    content: {
        'application/json': {
            schema: AddBoardMemberSchema.openapi({ example: { userId: '123e4567-e89b-12d3-a456-426614174000', role: BoardMemberRole.MEMBER } })
        }
    }
}
export const PatchBoardMemberRequest: ZodRequestBody = {
    description: 'Update a member role in the board',
    content: {
        'application/json': {
            schema: UpdateBoardMemberRoleSchema.openapi({ example: { role: BoardMemberRole.MEMBER } })
        }
    }
}
export type AddBoardMemberSchema = z.infer<typeof AddBoardMemberSchema>;
export type UpdateBoardMemberRoleSchema = z.infer<typeof UpdateBoardMemberRoleSchema>;