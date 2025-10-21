import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { ResourceType } from '@/common/entities/permission.entity';
extendZodWithOpenApi(z)

export const PermissionResponseSchema = z.object({
    id: z.uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
    name: z.string().openapi({ example: 'workspace.read' }),
    resourceType: z.enum(ResourceType).openapi({ example: ResourceType.WORKSPACE }),
    description: z.string().optional().openapi({ example: 'permission description here' })
})

export const ListPermissionResponseSchema = z.array(PermissionResponseSchema)
export type PermissionResponse = z.infer<typeof PermissionResponseSchema>
export type ListPermissionResponse = z.infer<typeof ListPermissionResponseSchema>

