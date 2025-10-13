import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
extendZodWithOpenApi(z);

export const BoardResponseSchema = z.object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    title: z.string().min(1).max(100).openapi({ example: 'Project Board' }),
    description: z.string().max(500).optional().openapi({ example: 'This board is for managing project tasks.' }),
    createdAt: z.string().openapi({ example: '2023-10-01T12:00:00Z' }),
    updatedAt: z.string().openapi({ example: '2023-10-05T15:30:00Z' }),
})

