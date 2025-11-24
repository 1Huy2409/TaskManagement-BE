import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

const PermissionSchema = z.object({
    id: z.uuid().openapi({
        example: 'a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
        description: 'Permission UUID'
    }),
    action: z.string().openapi({
        example: 'workspace:view',
        description: 'Permission action'
    }),
    resourceType: z.string().openapi({
        example: 'workspace',
        description: 'Resource type'
    }),
    description: z.string().openapi({
        example: 'View workspace details',
        description: 'Permission description'
    })
});

const RolePermissionSchema = z.object({
    id: z.uuid().openapi({
        example: 'b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7',
        description: 'Role-Permission UUID'
    }),
    permission: PermissionSchema
});

export const WorkspaceRoleResponseSchema = z.object({
    id: z.uuid().openapi({
        example: 'c3d4e5f6-7g8h-9i0j-1k2l-m3n4o5p6q7r8',
        description: 'Role UUID'
    }),
    name: z.string().openapi({
        example: 'workspace_admin',
        description: 'Role name'
    }),
    description: z.string().nullable().openapi({
        example: 'Workspace Admin with elevated permissions',
        description: 'Role description'
    }),
    scope: z.string().openapi({
        example: 'workspace',
        description: 'Role scope (workspace or board)'
    }),
    isSystemRole: z.boolean().openapi({
        example: true,
        description: 'Is this a system role or custom role'
    }),
    workspaceId: z.uuid().nullable().openapi({
        example: null,
        description: 'Workspace ID (null for system roles)'
    }),
    rolePermissions: z.array(RolePermissionSchema).optional().openapi({
        description: 'Array of role permissions'
    })
});

export const ListWorkspaceRoleResponseSchema = z.array(WorkspaceRoleResponseSchema);

export type WorkspaceRoleResponse = z.infer<typeof WorkspaceRoleResponseSchema>;
export type ListWorkspaceRoleResponse = z.infer<typeof ListWorkspaceRoleResponseSchema>;
