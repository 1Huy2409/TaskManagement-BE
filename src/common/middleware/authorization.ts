import { AuthorizationHelper } from "../utils/authorizationHelper";
import { NextFunction, Request, Response } from "express";
import { AuthFailureError, BadRequestError, ForbiddenError } from "../handler/error.response";

const authorizationHelper = new AuthorizationHelper();

export const checkWorkspacePermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new AuthFailureError('User not authenticated', 401);
            }
            const workspaceId = req.params.workspaceId || req.params.id || req.body.workspaceId;
            if (!workspaceId) {
                throw new BadRequestError('Workspace ID is required');
            }
            const hasPermission = await authorizationHelper.canAccessWorkspace(
                userId,
                workspaceId,
                requiredPermission
            )
            if (!hasPermission) {
                throw new ForbiddenError('You do not have permission to access this workspace');
            }
            next();
        }
        catch (error) {
            next(error)
        }
    }
}
export const checkBoardPermission = (requiredPermission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id
            if (!userId) {
                throw new AuthFailureError('User not authenticated', 401);
            }
            const boardId = req.params.boardId || req.params.id || req.body.boardId;
            if (!boardId) {
                throw new BadRequestError('Board ID is required');
            }
            const hasPermission = await authorizationHelper.canAccessBoard(
                userId,
                boardId,
                requiredPermission
            )
            if (!hasPermission) {
                throw new ForbiddenError('You do not have permission to access this board');
            }
            next();
        }
        catch (error) {
            console.error('Error in checkBoardPermission middleware:', error);
            next(error)
        }
    }
}
export const checkWorkspaceOwner = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id
        if (!userId) {
            throw new AuthFailureError('User not authenticated', 401);
        }
        const workspaceId = req.params.workspaceId || req.params.id || req.body.workspaceId;
        if (!workspaceId) {
            throw new BadRequestError('Workspace ID is required');
        }
        const isOwner = await authorizationHelper.isWorkspaceOwner(userId, workspaceId);
        if (!isOwner) {
            throw new ForbiddenError('You are not the owner of this workspace');
        }
        next();
    }
    catch (error) {
        next(error)
    }
}