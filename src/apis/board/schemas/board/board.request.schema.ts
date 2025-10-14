import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { BoardVisibility } from '@/common/entities/board.entity';

extendZodWithOpenApi(z);
export const CreateBoardSchema = z.object({
    title: z.string().min(1).max(255).openapi({ description: 'Title of the board', example: 'Project Alpha' }),
    description: z.string().max(1000).nullable().optional().openapi({ description: 'Description of the board', example: 'This is a sample board description.' }),
    coverUrl: z.url().min(10).max(255).optional().openapi({ description: 'Cover image URL of the board', example: 'https://example.com/cover.jpg' }),
    visibility: z.enum(BoardVisibility).optional().default(BoardVisibility.WORKSPACE).openapi({ description: 'Visibility of the board', example: BoardVisibility.WORKSPACE }),
})
export const PostBoardRequest: ZodRequestBody = {
    description: 'Create new board',
    content: {
        'application/json': {
            schema: CreateBoardSchema.openapi({ example: { title: 'Project Alpha', description: 'This is a sample board description.', coverUrl: 'https://example.com/cover.jpg', visibility: BoardVisibility.WORKSPACE } })
        }
    }
}

export const UpdateBoardSchema = z.object({
    title: z.string().min(1).max(255).optional().openapi({ description: 'Title of the board', example: 'Project Alpha' }),
    description: z.string().max(1000).nullable().optional().openapi({ description: 'Description of the board', example: 'This is a sample board description.' }),
    coverUrl: z.url().min(10).max(255).optional().openapi({ description: 'Cover image URL of the board', example: 'https://example.com/cover.jpg' }),
    visibility: z.enum(BoardVisibility).optional().default(BoardVisibility.WORKSPACE).openapi({ description: 'Visibility of the board', example: BoardVisibility.WORKSPACE }),
})
export const PatchBoardRequest: ZodRequestBody = {
    description: 'Update board',
    content: {
        'application/json': {
            schema: UpdateBoardSchema.openapi({ example: { title: 'Project Alpha', description: 'This is a sample board description.', coverUrl: 'https://example.com/cover.jpg', visibility: BoardVisibility.WORKSPACE } })
        }
    }
}

export type CreateBoardSchema = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardSchema = z.infer<typeof UpdateBoardSchema>;
export type PostBoardRequest = z.infer<typeof CreateBoardSchema>;
export type PatchBoardRequest = z.infer<typeof UpdateBoardSchema>;

