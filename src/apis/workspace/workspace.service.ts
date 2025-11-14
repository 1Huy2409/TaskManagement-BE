import { AddWorkspaceMemberSchema, UpdateWorkspaceMemberRoleSchema } from './schemas/workspace-member/workspace-member.request.schema';
import { Workspace } from "@/common/entities/workspace.entity";
import { ConflictRequestError, NotFoundError } from "@/common/handler/error.response";
import { Repository } from "typeorm";
import { CreateWorkspaceSchema, UpdateWorkspaceSchema, WorkspaceMemberResponse, WorkspaceResponse } from "./schemas";
import { toWorkspaceResponse } from "./mapper/workspace.mapper";
import { WorkspaceMember } from "@/common/entities/workspace-member.entity";
import { Board, BoardVisibility } from '@/common/entities/board.entity';
import { BoardResponse, CreateBoardSchema, UpdateBoardSchema } from '../board/schemas';
import { toBoardResponse } from '../board/mapper/board.mapper';
import { Role, RoleScope } from '@/common/entities/role.entity';
import { IWorkspaceRepository } from './repositories/workspace.repository.interface';
import { IWorkspaceMemberRepository } from './repositories/workspace-member.repository.interface';
import { IBoardRepository } from '../board/repositories/board.repository.interface';
import { IRoleRepository } from '../role/repositories/role.repository.interface';
import { toWorkspaceMemberResponse } from './mapper/workspace-member.mapper';

export default class WorkspaceService {
    constructor(
        private workspaceRepository: IWorkspaceRepository,
        private workspaceMemberRespository: IWorkspaceMemberRepository,
        private boardRepository: IBoardRepository,
        private roleRepository: IRoleRepository
    ) { }
    // base crud for workspace
    findAll = async (userId: string): Promise<WorkspaceResponse[]> => {
        const workspaces = await this.workspaceRepository.findByUserId(userId);
        return workspaces.map(toWorkspaceResponse);
    }
    findById = async (id: string): Promise<WorkspaceResponse> => {
        const workspace = await this.workspaceRepository.findById(id);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${id} not found`);
        }
        return toWorkspaceResponse(workspace);
    }
    create = async (data: CreateWorkspaceSchema, ownerId: string): Promise<WorkspaceResponse> => {
        const { title, description, visibility } = data;

        const existingWorkspace = await this.workspaceRepository.findByName(title, ownerId);
        if (existingWorkspace) {
            throw new ConflictRequestError('Workspace with this title already exists');
        }
        const newWorkspace = await this.workspaceRepository.create({
            title,
            description: description ?? '',
            visibility,
            ownerId
        });

        const ownerRole = await this.roleRepository.findByName('workspace_owner', RoleScope.WORKSPACE);
        if (!ownerRole) {
            throw new NotFoundError('Workspace owner role not found!');
        }
        await this.workspaceMemberRespository.create({
            role: ownerRole,
            userId: ownerId,
            workspaceId: newWorkspace.id
        });
        return toWorkspaceResponse(newWorkspace);
    }
    update = async (data: UpdateWorkspaceSchema, id: string): Promise<{ message: string, workspace: WorkspaceResponse }> => {
        const { title, ...rest } = data;
        const workspace = await this.workspaceRepository.findById(id);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${id} not found`);
        }
        // set flag handle isChange?
        const isChange = ((title && title !== workspace.title) || (rest.description && rest.description !== workspace.description) || (rest.visibility && rest.visibility !== workspace.visibility));
        const message: string = isChange ? 'Workspace updated successfully' : 'No changes detected';
        if (!isChange) {
            return { message, workspace: toWorkspaceResponse(workspace) };
        }
        if (title && title !== workspace.title) {
            const existingWorkspace = await this.workspaceRepository.findByName(title, workspace.ownerId);
            if (existingWorkspace) {
                throw new ConflictRequestError('Workspace with this title already exists');
            }
            workspace.title = title;
        }
        workspace.description = rest.description ?? workspace.description;
        workspace.visibility = rest.visibility ?? workspace.visibility;
        await this.workspaceRepository.update(id, workspace);
        return { message, workspace: toWorkspaceResponse(workspace) };
    }
    // remake this api deeper (for board,...)
    delete = async (id: string, ownerId: string): Promise<{ message: string }> => {
        const workspace = await this.workspaceRepository.findOneByOwnerId(id, ownerId);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${id} not found or you are not the owner`);
        }
        // update status
        workspace.isActive = false;
        workspace.boards.forEach(board => board.isActive = false);
        await this.workspaceRepository.update(id, workspace);
        return {
            message: 'Delete workspace successfully!'
        }
    }

    // advance crud for workspace
    getWorkspaceMembers = async (id: string): Promise<WorkspaceMemberResponse[]> => {
        const workspaceMember = await this.workspaceMemberRespository.findByWorkspaceId(id);
        if (!workspaceMember.length) {
            throw new NotFoundError(`No members found in workspace with id ${id}`);
        }
        return workspaceMember.map(toWorkspaceMemberResponse);
    }
    addMemberToWorkspace = async (data: AddWorkspaceMemberSchema, workspaceId: string): Promise<{ message: string }> => {
        const { userId, roleId } = data;
        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const existingMember = await this.workspaceMemberRespository.findByWorkspaceAndUserId(workspaceId, userId);
        if (existingMember) {
            throw new ConflictRequestError('User is already a member of this workspace');
        }
        const role = await this.roleRepository.findById(roleId, RoleScope.WORKSPACE);
        if (!role) {
            throw new NotFoundError('Invalid role ID or role is not for workspace');
        }
        await this.workspaceMemberRespository.create({
            role,
            userId,
            workspaceId
        });
        // should return current list member after add
        return {
            message: 'Add member to workspace successfully!'
        }
    }
    updateMemberRole = async (workspaceId: string, userId: string, data: UpdateWorkspaceMemberRoleSchema): Promise<{ message: string }> => {
        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const existingMember = await this.workspaceMemberRespository.findByWorkspaceAndUserId(workspaceId, userId);
        if (!existingMember) {
            throw new NotFoundError('User is not a member of this workspace');
        }

        // Verify new role exists and is workspace scope
        const role = await this.roleRepository.findById(data.roleId, RoleScope.WORKSPACE);
        if (!role) {
            throw new NotFoundError('Invalid role ID or role is not for workspace');
        }

        existingMember.roleId = data.roleId;
        await this.workspaceMemberRespository.update(existingMember.id, existingMember);
        return {
            message: 'Update member role successfully!'
        }
    }
    removeMemberFromWorkspace = async (workspaceId: string, userId: string): Promise<{ message: string }> => {
        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const existingMember = await this.workspaceMemberRespository.findByWorkspaceAndUserId(workspaceId, userId);
        if (!existingMember) {
            throw new NotFoundError('User is not a member of this workspace');
        }
        await this.workspaceMemberRespository.delete(existingMember);
        return {
            message: 'Remove member from workspace successfully!'
        }
    }
    getAllBoardFromWorkspace = async (workspaceId: string): Promise<BoardResponse[]> => {
        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const boards = await this.boardRepository.findBoardsByWorkspaceId(workspaceId);
        return boards.map(toBoardResponse);
    }
    addBoardToWorkspace = async (workspaceId: string, boardData: CreateBoardSchema): Promise<BoardResponse> => {
        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const newBoard = await this.boardRepository.create({
            title: boardData.title,
            description: boardData.description ?? '',
            coverUrl: boardData.coverUrl ?? '',
            visibility: boardData.visibility ?? BoardVisibility.WORKSPACE,
            workspaceId: workspaceId
        });
        return toBoardResponse(newBoard);
    }
    updateBoardInWorkspace = async (workspaceId: string, boardId: string, boardData: UpdateBoardSchema): Promise<BoardResponse> => {
        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const board = await this.boardRepository.findBoardByWorkspaceId(boardId, workspaceId);
        if (!board) {
            throw new NotFoundError(`Board with id ${boardId} not found in workspace with id ${workspaceId}`);
        }
        board.title = boardData.title ?? board.title;
        board.description = boardData.description ?? board.description;
        board.coverUrl = boardData.coverUrl ?? board.coverUrl;
        board.visibility = boardData.visibility ?? board.visibility;
        await this.boardRepository.update(board.id, board);
        return toBoardResponse(board);
    }
    deleteBoardInWorkspace = async (workspaceId: string, boardId: string): Promise<{ message: string }> => {
        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const board = await this.boardRepository.findBoardByWorkspaceId(boardId, workspaceId);
        if (!board) {
            throw new NotFoundError(`Board with id ${boardId} not found in workspace with id ${workspaceId}`);
        }
        board.isActive = false;
        await this.boardRepository.update(board.id, board);
        return {
            message: 'Delete board successfully!'
        }
    }
}