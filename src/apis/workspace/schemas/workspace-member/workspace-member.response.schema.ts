import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { WorkspaceMemberRole } from '@/common/entities/workspace-member.entity';
extendZodWithOpenApi(z);
export const WorkspaceMemberResponseSchema = z.object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    userId: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    workspaceId: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    role: z.enum(WorkspaceMemberRole).openapi({ example: WorkspaceMemberRole.ADMIN }),
    created_at: z.date(),
    updated_at: z.date()
})

export type WorkspaceMemberResponse = z.infer<typeof WorkspaceMemberResponseSchema>;