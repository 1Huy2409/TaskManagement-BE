import { AddWorkspaceMemberSchema, UpdateWorkspaceMemberRoleSchema } from './schemas/workspace-member/workspace-member.request.schema';
import { Workspace } from "@/common/entities/workspace.entity";
import { ConflictRequestError, NotFoundError } from "@/common/handler/error.response";
import { Repository } from "typeorm";
import { CreateWorkspaceSchema, UpdateWorkspaceSchema, WorkspaceResponse } from "./schemas";
import { toWorkspaceResponse } from "./mapper/workspace.mapper";
import { WorkspaceMember, WorkspaceMemberRole } from "@/common/entities/workspace-member.entity";
import { Board } from '@/common/entities/board.entity';
import { BoardResponse, CreateBoardSchema, UpdateBoardSchema } from '../board/schemas';
import { toBoardResponse } from '../board/mapper/board.mapper';

export default class WorkspaceService {
    constructor(
        private workspaceRepository: Repository<Workspace>,
        private workspaceMemberRespository: Repository<WorkspaceMember>,
        private boardRepository: Repository<Board>
    ) { }
    // base crud for workspace
    findAll = async (): Promise<WorkspaceResponse[]> => {
        const workspaces = await this.workspaceRepository.find({
            where: { isActive: true },
        });
        if (!workspaces.length) {
            throw new NotFoundError('No workspaces found');
        }
        return workspaces.map(toWorkspaceResponse);
    }
    findById = async (id: string): Promise<WorkspaceResponse> => {
        const workspace = await this.workspaceRepository.findOne({ where: { id, isActive: true } });
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${id} not found`);
        }
        return toWorkspaceResponse(workspace);
    }
    create = async (data: CreateWorkspaceSchema, ownerId: string): Promise<WorkspaceResponse> => {
        const { title, description, visibility } = data;

        const existingWorkspace = await this.workspaceRepository.findOne({ where: { title, ownerId } });
        if (existingWorkspace) {
            throw new ConflictRequestError('Workspace with this title already exists');
        }
        const newWorkspace = this.workspaceRepository.create({
            title,
            description: description ?? '',
            visibility,
            ownerId
        });
        // add owner to member
        await this.workspaceRepository.save(newWorkspace);
        const newMember = this.workspaceMemberRespository.create({
            role: WorkspaceMemberRole.OWNER,
            user: { id: ownerId },
        });
        await this.workspaceMemberRespository.save(newMember);
        return toWorkspaceResponse(newWorkspace);
    }
    update = async (data: UpdateWorkspaceSchema, id: string): Promise<WorkspaceResponse> => {
        const { title, ...rest } = data;
        const workspace = await this.workspaceRepository.findOne({ where: { id: id, isActive: true } })
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${id} not found`);
        }

        if (title && title !== workspace.title) {
            const existingWorkspace = await this.workspaceRepository.findOne({ where: { title, ownerId: workspace.ownerId } });
            if (existingWorkspace) {
                throw new ConflictRequestError('Workspace with this title already exists');
            }
            workspace.title = title;
            workspace.description = rest.description ?? workspace.description;
            workspace.visibility = rest.visibility ?? workspace.visibility;
            await this.workspaceRepository.save(workspace);
        }
        return toWorkspaceResponse(workspace);
    }
    delete = async (id: string, ownerId: string): Promise<{ message: string }> => {
        const workspace = await this.workspaceRepository.findOne({ where: { id, ownerId, isActive: true } });
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${id} not found or you are not the owner`);
        }
        // update status
        workspace.isActive = false;
        await this.workspaceRepository.save(workspace);
        return {
            message: 'Delete workspace successfully!'
        }
    }

    // advance crud for workspace
    getWorkspaceMembers = async (id: string): Promise<any> => {
        const workspaceMember = await this.workspaceMemberRespository.find({
            where: { workspace: { id } },
            relations: ['user', 'workspace'],
            select: { user: { id: true, fullname: true, email: true, avatarUrl: true }, workspace: { id: true, title: true } }
        })
        if (!workspaceMember.length) {
            throw new NotFoundError(`No members found in workspace with id ${id}`);
        }
        return workspaceMember;
    }
    addMemberToWorkspace = async (data: AddWorkspaceMemberSchema, workspaceId: string): Promise<{ message: string }> => {
        const { userId, role } = data;
        const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId, isActive: true } });
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const existingMember = await this.workspaceMemberRespository.findOne({ where: { workspace: { id: workspaceId }, user: { id: userId } } });
        if (existingMember) {
            throw new ConflictRequestError('User is already a member of this workspace');
        }
        const newMember = this.workspaceMemberRespository.create({
            role,
            user: { id: userId },
            workspace: { id: workspaceId }
        });
        await this.workspaceMemberRespository.save(newMember);
        return {
            message: 'Add member to workspace successfully!'
        }
    }
    updateMemberRole = async (workspaceId: string, userId: string, data: UpdateWorkspaceMemberRoleSchema): Promise<{ message: string }> => {
        const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId, isActive: true } });
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const existingMember = await this.workspaceMemberRespository.findOne({ where: { workspace: { id: workspaceId }, user: { id: userId } } });
        if (!existingMember) {
            throw new NotFoundError('User is not a member of this workspace');
        }
        existingMember.role = data.role;
        await this.workspaceMemberRespository.save(existingMember);
        return {
            message: 'Update member role successfully!'
        }
    }
    removeMemberFromWorkspace = async (workspaceId: string, userId: string): Promise<{ message: string }> => {
        const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId, isActive: true } });
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const existingMember = await this.workspaceMemberRespository.findOne({ where: { workspace: { id: workspaceId }, user: { id: userId } } });
        if (!existingMember) {
            throw new NotFoundError('User is not a member of this workspace');
        }
        await this.workspaceMemberRespository.remove(existingMember);
        return {
            message: 'Remove member from workspace successfully!'
        }
    }
    getAllBoardFromWorkspace = async (workspaceId: string): Promise<BoardResponse[]> => {
        const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId, isActive: true } });
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const boards = await this.boardRepository.find({
            where: { workspace: { id: workspaceId }, isActive: true },
            relations: ['workspace']
        })
        if (!boards.length) {
            throw new NotFoundError(`No boards found in workspace with id ${workspaceId}`);
        }
        return boards.map(toBoardResponse);
    }
    addBoardToWorkspace = async (workspaceId: string, boardData: CreateBoardSchema): Promise<BoardResponse> => {
        const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId, isActive: true } });
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const newBoard = this.boardRepository.create({
            title: boardData.title,
            description: boardData.description ?? '',
            coverUrl: boardData.coverUrl ?? '',
            visibility: boardData.visibility,
            workspace: { id: workspaceId }
        });
        await this.boardRepository.save(newBoard);
        return toBoardResponse(newBoard);
    }
    updateBoardInWorkspace = async (workspaceId: string, boardId: string, boardData: UpdateBoardSchema): Promise<BoardResponse> => {
        const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId, isActive: true } });
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const board = await this.boardRepository.findOne({
            where: { id: boardId, workspace: { id: workspaceId }, isActive: true },
            relations: ['workspace']
        });
        if (!board) {
            throw new NotFoundError(`Board with id ${boardId} not found in workspace with id ${workspaceId}`);
        }
        board.title = boardData.title ?? board.title;
        board.description = boardData.description ?? board.description;
        board.coverUrl = boardData.coverUrl ?? board.coverUrl;
        board.visibility = boardData.visibility ?? board.visibility;
        await this.boardRepository.save(board);
        return toBoardResponse(board);
    }
    deleteBoardInWorkspace = async (workspaceId: string, boardId: string): Promise<{ message: string }> => {
        const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId, isActive: true } });
        if (!workspace) {
            throw new NotFoundError(`Workspace with id ${workspaceId} not found`);
        }
        const board = await this.boardRepository.findOne({ where: { id: boardId, workspace: { id: workspaceId }, isActive: true } });
        if (!board) {
            throw new NotFoundError(`Board with id ${boardId} not found in workspace with id ${workspaceId}`);
        }
        board.isActive = false;
        await this.boardRepository.save(board);
        return {
            message: 'Delete board successfully!'
        }
    }
}