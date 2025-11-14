import { WorkspaceJoinLink } from "@/common/entities/workspace-join-link.entity";
import { JoinLinkResponse } from "../schemas/join-link.schema";
import dotenv from "dotenv";
dotenv.config();
export const toJoinLinkResponse = (joinLink: WorkspaceJoinLink): JoinLinkResponse => {
    const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
    return {
        id: joinLink.id,
        token: joinLink.token,
        fullLink: `${baseUrl}/join/${joinLink.token}`,
        expiresAt: joinLink.expiresAt,
        maxUses: joinLink.maxUses,
        usedCount: joinLink.usedCount,
        isActive: joinLink.isActive,
        createdAt: joinLink.created_at,
    }
}