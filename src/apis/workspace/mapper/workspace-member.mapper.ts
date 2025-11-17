import { WorkspaceMember } from "@/common/entities/workspace-member.entity";
import { WorkspaceMemberResponse } from "../schemas";

export const toWorkspaceMemberResponse = (workspaceMember: WorkspaceMember): WorkspaceMemberResponse => ({
    id: workspaceMember.id,
    userId: workspaceMember.userId,
    workspaceId: workspaceMember.workspaceId,
    fullname: workspaceMember.user?.fullname,
    roleName: workspaceMember.role?.name,
})