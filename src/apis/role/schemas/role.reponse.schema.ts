import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { RoleScope } from '@/common/entities/role.entity';

extendZodWithOpenApi(z)

export const RoleResponseSchema = z.object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    name: z.string().openapi({ example: 'workspace_admin' }),
    scope: z.enum(RoleScope).openapi({ example: RoleScope.WORKSPACE }),
    description: z.string().optional().openapi({ example: 'Admin of this workspace' }),
    isSystemRole: z.boolean().openapi({ example: false }),
    created_at: z.date(),
    updated_at: z.date()
})

export const ListRoleResponseSchema = z.array(RoleResponseSchema)

export type ListRoleResponse = z.infer<typeof ListRoleResponseSchema>
export type RoleResponse = z.infer<typeof RoleResponseSchema>