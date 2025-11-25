export interface CreateWorkspaceRoleDto {
    name: string;
    description?: string;
    permissions: string[];
}

export interface UpdateWorkspaceRoleDto {
    name?: string;
    description?: string;
    permissions?: string[];
}
