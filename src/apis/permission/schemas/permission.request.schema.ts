import { z } from 'zod'
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi'
import { ResourceType } from '@/common/entities/permission.entity'
extendZodWithOpenApi(z)

export const CreatePermissionSchema = z.object({
    name: z.string().openapi({ example: 'workspace.create' }),
    resourceType: z.enum(ResourceType).openapi({ example: ResourceType.WORKSPACE }),
    description: z.string().optional().openapi({ example: 'Permission description here' }),
})

export const UpdatePermissionSchema = z.object({
    name: z.string().optional().openapi({ example: 'workspace.update' }),
    resourceType: z.enum(ResourceType).openapi({ example: ResourceType.LIST }),
    description: z.string().optional().openapi({ example: 'Permission description here' })
})

export const PostPermissionRequest: ZodRequestBody = {
    description: 'Create new permission',
    content: {
        'application/json': {
            schema: CreatePermissionSchema.openapi({
                example: {
                    name: 'workspace.create',
                    resourceType: ResourceType.WORKSPACE,
                    description: 'permission description'
                }
            })
        }
    }
}
export const PatchPermissionRequest: ZodRequestBody = {
    description: 'Update new permission',
    content: {
        'application/json': {
            schema: UpdatePermissionSchema.openapi({
                example: {
                    name: 'workspace.update',
                    resourceType: ResourceType.WORKSPACE,
                    description: 'permission description'
                }
            })
        }
    }
}
export type CreatePermissionSchema = z.infer<typeof CreatePermissionSchema>
export type UpdatePermisisonSchema = z.infer<typeof UpdatePermissionSchema>
export type PostPermissionRequest = z.infer<typeof CreatePermissionSchema>
export type PatchPermissionRequest = z.infer<typeof UpdatePermissionSchema>