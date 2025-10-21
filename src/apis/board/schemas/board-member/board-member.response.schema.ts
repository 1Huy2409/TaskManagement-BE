import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);
export const BoardMemberResponseSchema = z.object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    userId: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    boardId: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    roleName: z.string().openapi({ example: 'card_create' }),
    created_at: z.date(),
    updated_at: z.date()
})

export type BoardMemberResponse = z.infer<typeof BoardMemberResponseSchema>;