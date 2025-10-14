import { Request, Response } from "express";
import WorkspaceService from "./workspace.service";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import { StatusCodes } from "http-status-codes";
import { handleServiceResponse } from "@/common/utils/httpHandler";
import { AuthFailureError, BadRequestError } from "@/common/handler/error.response";
import { AddWorkspaceMemberSchema, CreateWorkspaceSchema, UpdateWorkspaceMemberRoleSchema, UpdateWorkspaceSchema } from "./schemas";
import { CreateBoardSchema, UpdateBoardSchema } from "../board/schemas";

export default class WorkspaceController {
    constructor(
        private workspaceService: WorkspaceService
    ) { }

    findAll = async (req: Request, res: Response) => {
        const workspaces = await this.workspaceService.findAll();
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get all workspaces successfully',
            workspaces,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    findById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('Workspace id is required');
        }
        const workspace = await this.workspaceService.findById(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get workspace by ID successfully',
            workspace,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    create = async (req: Request, res: Response) => {
        const data: CreateWorkspaceSchema = req.body;
        const ownerId = req.user?.id;
        if (!ownerId) {
            throw new AuthFailureError('Authentication failure');
        }
        const newWorkspace = await this.workspaceService.create(data, ownerId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Create workspace successfully',
            newWorkspace,
            StatusCodes.CREATED
        )
        return handleServiceResponse(serviceResponse, res);
    }
    update = async (req: Request, res: Response) => {
        const { id } = req.params;
        const data: UpdateWorkspaceSchema = req.body;
        if (!id) {
            throw new BadRequestError('Workspace id is required');
        }
        const updatedWorkspace = await this.workspaceService.update(data, id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Update workspace successfully',
            updatedWorkspace,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        const ownerId = req.user?.id;
        if (!id) {
            throw new BadRequestError('Workspace id is required');
        }
        const message = await this.workspaceService.delete(id, ownerId!);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Delete workspace successfully',
            message,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    getWorkspaceMembers = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('Workspace id is required');
        }
        const members = await this.workspaceService.getWorkspaceMembers(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get workspace members successfully',
            members,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    addMemberToWorkspace = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError('Workspace id is required');
        }
        const data: AddWorkspaceMemberSchema = req.body;
        const message = await this.workspaceService.addMemberToWorkspace(data, id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Add member to workspace successfully',
            message,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    updateMemberRole = async (req: Request, res: Response) => {
        const { id, userId } = req.params;
        if (!id || !userId) {
            throw new BadRequestError('Workspace id and User id are required');
        }
        const data: UpdateWorkspaceMemberRoleSchema = req.body;
        const message = await this.workspaceService.updateMemberRole(id, userId, data);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Update member role successfully',
            message,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    removeMemberFromWorkspace = async (req: Request, res: Response) => {
        const { id, userId } = req.params;
        if (!id || !userId) {
            throw new BadRequestError('Workspace id and User id are required');
        }
        const message = await this.workspaceService.removeMemberFromWorkspace(id, userId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Remove member from workspace successfully',
            message,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    getAllBoardFromWorkspace = async (req: Request, res: Response) => {
        const { id } = req.params;
        console.log(id)
        if (!id) {
            throw new BadRequestError('Workspace id is required');
        }
        const boards = await this.workspaceService.getAllBoardFromWorkspace(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Get all boards in workspace successfully',
            boards,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    addBoardToWorkspace = async (req: Request, res: Response) => {
        const { id } = req.params;
        const boardData: CreateBoardSchema = req.body;
        if (!id) {
            throw new BadRequestError('Workspace id is required');
        }
        const newBoard = await this.workspaceService.addBoardToWorkspace(id, boardData)
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Add board into workspace successfully',
            newBoard,
            StatusCodes.CREATED
        )
        return handleServiceResponse(serviceResponse, res);
    }
    updateBoardInWorkspace = async (req: Request, res: Response) => {
        const { id, boardId } = req.params;
        const boardData: UpdateBoardSchema = req.body;
        if (!id || !boardId) {
            throw new BadRequestError('Workspace id and Board id are required');
        }
        const updatedBoard = await this.workspaceService.updateBoardInWorkspace(id, boardId, boardData);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Update board in workspace successfully',
            updatedBoard,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
    deleteBoardInWorkspace = async (req: Request, res: Response) => {
        const { id, boardId } = req.params;
        if (!id || !boardId) {
            throw new BadRequestError('Workspace id and Board id are required');
        }
        const message = await this.workspaceService.deleteBoardInWorkspace(id, boardId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            'Delete board in workspace successfully',
            message,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
}