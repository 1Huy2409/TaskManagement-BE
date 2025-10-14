import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { BoardMemberRole } from '@/common/entities/board-member.entity';

extendZodWithOpenApi(z);
export const BoardMemberResponseSchema = z.object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    userId: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    boardId: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    role: z.enum(BoardMemberRole).openapi({ example: BoardMemberRole.ADMIN }),
    created_at: z.date(),
    updated_at: z.date()
})

export type BoardMemberResponse = z.infer<typeof BoardMemberResponseSchema>;