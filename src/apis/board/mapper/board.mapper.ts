import { Board } from "@/common/entities/board.entity";
import { BoardResponse } from "../schemas";

export const toBoardResponse = (board: Board): BoardResponse => ({
    id: board.id,
    title: board.title,
    description: board.description,
    coverUrl: board.coverUrl,
    visibility: board.visibility,
    workspaceId: board.workspaceId,
    created_at: board.created_at,
    updated_at: board.updated_at,
})