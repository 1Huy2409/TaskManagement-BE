import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { RoleScope } from '@/common/entities/role.entity';
extendZodWithOpenApi(z)

export const CreateRoleSchema = z.object({
    name: z.string().openapi({ example: 'workspace_admin' }),
    scope: z.enum(RoleScope).openapi({ example: RoleScope.WORKSPACE }),
    description: z.string().optional().openapi({ example: 'Admin of workspace' }),
    isSystemRole: z.boolean().optional().openapi({ example: false })
})
export const PostRoleRequest: ZodRequestBody = {
    description: 'Create new role with scope',
    content: {
        'application/json': {
            schema: CreateRoleSchema.openapi({
                example: {
                    title: 'workspace_admin',
                    scope: RoleScope.BOARD,
                    descripton: 'description is empty',
                    isSystemRole: false
                }
            })
        }
    }
}

export const UpdateRoleSchema = z.object({
    name: z.string().optional().openapi({ example: 'workspace_admin' }),
    scope: z.enum(RoleScope).optional().openapi({ example: RoleScope.WORKSPACE }),
    description: z.string().optional().openapi({ example: 'Admin of workspace' }),
    isSystemRole: z.boolean().optional().openapi({ example: false })
})
export const PatchRoleRequest: ZodRequestBody = {
    description: 'Update role with scope',
    content: {
        'application/json': {
            schema: UpdateRoleSchema.openapi({
                example: {
                    title: 'workspace_admin',
                    scope: RoleScope.BOARD,
                    descripton: 'description is empty',
                    isSystemRole: false
                }
            })
        }
    }
}

export type CreateRoleSchema = z.infer<typeof CreateRoleSchema>
export type UpdateRoleSchema = z.infer<typeof UpdateRoleSchema>
export type PostRoleRequest = z.infer<typeof CreateRoleSchema>
export type PatchRoleRequest = z.infer<typeof UpdateRoleSchema>
