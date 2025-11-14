import { ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

export const CreateJoinLinkSchema = z.object({
    expiresIn: z.number().min(1).max(365).optional().default(7),
    maxUses: z.number().min(1).optional(),
});
export const PostJoinLinkRequest: ZodRequestBody = {
    description: 'Create a join link for a workspace',
    content: {
        'application/json': {
            schema: CreateJoinLinkSchema.openapi({ example: { expiresIn: 7, maxUses: 10 } })
        }
    }
}
export const JoinWorkspaceByLinkShema = z.object({
    token: z.string().min(1)
})
export const PostJoinWorkspaceByLinkRequest: ZodRequestBody = {
    description: 'Join a workspace using a join link token',
    content: {
        'application/json': {
            schema: JoinWorkspaceByLinkShema.openapi({ example: { token: 'abc123token' } })
        }
    }
}

export type CreateJoinLinkDto = z.infer<typeof CreateJoinLinkSchema>;
export type JoinWorkspaceByLinkDto = z.infer<typeof JoinWorkspaceByLinkShema>;
export const JoinLinkResponseSchema = z.object({
    id: z.uuid().openapi({
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        description: 'Join Link UUID',
        format: 'uuid'
    }),
    token: z.string().openapi({
        example: 'abc123token',
        description: 'Join Link Token'
    }),
    fullLink: z.url().openapi({
        example: 'https://yourapp.com/join/abc123token',
        description: 'Full Join Link URL'
    }),
    expiresAt: z.date().openapi({
        example: '2024-12-31T23:59:59.000Z',
        description: 'Expiration date of the join link'
    }),
    maxUses: z.number().nullable().openapi({
        example: 10,
        description: 'Maximum number of uses for the join link'
    }),
    usedCount: z.number().openapi({
        example: 3,
    }),
    isActive: z.boolean().openapi({
        example: true,
        description: 'Indicates if the join link is active'
    }),
    createdAt: z.date().openapi({
        example: '2024-01-01T12:00:00.000Z',
        description: 'Creation date of the join link'
    })
});
export interface JoinLinkResponse {
    id: string;
    token: string;
    fullLink: string;
    expiresAt: Date;
    maxUses: number | null;
    usedCount: number;
    isActive: boolean;
    createdAt: Date;
}