import { Workspace } from "@/common/entities/workspace.entity";
import { WorkspaceResponse } from "../schemas";

export const toWorkspaceResponse = (workspace: Workspace): WorkspaceResponse => ({
    id: workspace.id,
    title: workspace.title,
    description: workspace.description,
    visibility: workspace.visibility,
    created_at: workspace.created_at,
    updated_at: workspace.updated_at,
})