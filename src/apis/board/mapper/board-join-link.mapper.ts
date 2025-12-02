import { BoardJoinLink } from "@/common/entities/board-join-link.entity";
import { BoardJoinLinkResponse } from "../schemas/board-join-link/board-join-link.schema";
import dotenv from "dotenv";

dotenv.config();

export const toBoardJoinLinkResponse = (joinLink: BoardJoinLink): BoardJoinLinkResponse => {
    const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
    return {
        id: joinLink.id,
        token: joinLink.token,
        fullLink: `${baseUrl}/board/join/${joinLink.token}`,
        expiresAt: joinLink.expiresAt,
        maxUses: joinLink.maxUses,
        usedCount: joinLink.usedCount,
        isActive: joinLink.isActive,
        createdAt: joinLink.created_at,
    }
}
