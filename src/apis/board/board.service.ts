import { BoardResponse, CreateBoardSchema, UpdateBoardSchema, CreateBoardJoinLinkDto, BoardJoinLinkResponse, InviteByEmailDto } from "./schemas";
import { NotFoundError, ConflictRequestError, BadRequestError } from "@/common/handler/error.response";
import { toBoardResponse } from "./mapper/board.mapper";
import { toBoardJoinLinkResponse } from "./mapper/board-join-link.mapper";
import { IBoardRepository } from "./repositories/board.repository.interface";
import { IWorkspaceRepository } from "../workspace/repositories/workspace.repository.interface";
import { IBoardJoinLinkRepository } from "./repositories/board-join-link.repository.interface";
import { IBoardMemberRepository } from "./repositories/board-member.repository.interface";
import { IRoleRepository } from "../role/repositories/role.repository.interface";
import { BoardVisibility } from '@/common/entities/board.entity';
import { BoardJoinLink } from "@/common/entities/board-join-link.entity";
import { RoleScope } from "@/common/entities/role.entity";
import { nanoid } from "nanoid";

export default class BoardService {
    constructor(
        private boardRepository: IBoardRepository,
        private workspaceRepository: IWorkspaceRepository,
        private boardJoinLinkRepository: IBoardJoinLinkRepository,
        private boardMemberRepository: IBoardMemberRepository,
        private roleRepository: IRoleRepository,
    ) { }

    // get board with visibility is public
    getAllPublicBoards = async (): Promise<BoardResponse[]> => {
        const boards = await this.boardRepository.findPublicBoards();
        if (!boards.length) {
            throw new NotFoundError('No public boards found');
        }
        return boards.map(toBoardResponse)
    }
    getPublicBoardById = async (id: string): Promise<BoardResponse> => {
        const board = await this.boardRepository.findPublicBoardById(id);
        if (!board) {
            throw new NotFoundError(`Board with ID ${id} not found`);
        }
        return toBoardResponse(board);
    }
    delete = async (id: string): Promise<any> => {
        return await this.boardRepository.delete(id);
    }

    createBoard = async (workspaceId: string, data: CreateBoardSchema, creatorId: string): Promise<BoardResponse> => {
        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundError(`Workspace with ID ${workspaceId} not found`);
        }

        const board = await this.boardRepository.create({
            title: data.title,
            description: data.description ?? '',
            coverUrl: data.coverUrl ?? '',
            visibility: data.visibility,
            workspaceId,
            createdBy: creatorId
        });

        return toBoardResponse(board);
    }

    updateBoard = async (id: string, data: UpdateBoardSchema): Promise<BoardResponse> => {
        const board = await this.boardRepository.findById(id);
        if (!board) {
            throw new NotFoundError(`Board with ID ${id} not found`);
        }
        if (data.visibility === BoardVisibility.PUBLIC) {
            const workspace = await this.workspaceRepository.findById(board.workspaceId);
            if (!workspace) {
                throw new NotFoundError(`Workspace with ID ${board.workspaceId} not found`);
            }
            if (!workspace.visibility) {
                throw new ConflictRequestError('Workspace does not allow public boards');
            }
        }
        board.title = data.title ?? board.title;
        board.description = data.description ?? board.description;
        board.coverUrl = data.coverUrl ?? board.coverUrl;
        board.visibility = data.visibility ?? board.visibility;
        await this.boardRepository.update(board.id, board);
        return toBoardResponse(board);
    }

    // Board invite methods
    createBoardJoinLink = async (
        boardId: string,
        userId: string,
        data: CreateBoardJoinLinkDto
    ): Promise<BoardJoinLinkResponse> => {
        const board = await this.boardRepository.findById(boardId);
        if (!board) {
            throw new NotFoundError('Board not found');
        }

        const token = nanoid(10);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + data.expiresIn);

        const joinLink = await this.boardJoinLinkRepository.create({
            boardId,
            token,
            createdBy: userId,
            expiresAt,
            maxUses: data.maxUses || 10,
            usedCount: 0,
            isActive: true,
        });

        return toBoardJoinLinkResponse(joinLink);
    }

    joinBoardByLink = async (token: string, userId: string): Promise<{ message: string }> => {
        const joinLink = await this.boardJoinLinkRepository.findByToken(token);
        if (!joinLink) {
            throw new NotFoundError('Join link not found or inactive');
        }

        await this.validateJoinLink(joinLink);

        const isMember = await this.boardMemberRepository.findByBoardAndUserId(joinLink.boardId, userId);
        if (isMember) {
            throw new ConflictRequestError('User is already a member of the board');
        }

        const memberRole = await this.roleRepository.findByName('board_member', RoleScope.BOARD);
        if (!memberRole) {
            throw new NotFoundError('Board member role not found');
        }

        await this.boardMemberRepository.create({
            boardId: joinLink.boardId,
            userId,
            roleId: memberRole.id,
        });

        await this.boardJoinLinkRepository.incrementUsedCount(joinLink.id);

        if (joinLink.maxUses && joinLink.usedCount + 1 >= joinLink.maxUses) {
            joinLink.isActive = false;
            await this.boardJoinLinkRepository.save(joinLink);
        }

        return {
            message: 'Successfully joined the board',
        }
    }

    getBoardJoinLinks = async (boardId: string): Promise<BoardJoinLinkResponse[]> => {
        const joinLinks = await this.boardJoinLinkRepository.findByBoardId(boardId);
        return joinLinks.map(toBoardJoinLinkResponse);
    }

    revokeBoardJoinLink = async (joinLinkId: string, boardId: string): Promise<{ message: string }> => {
        const joinLink = await this.boardJoinLinkRepository.findById(joinLinkId);
        if (!joinLink) {
            throw new NotFoundError('Join link not found');
        }
        if (joinLink.boardId !== boardId) {
            throw new BadRequestError('Join link does not belong to the specified board');
        }

        joinLink.isActive = false;
        await this.boardJoinLinkRepository.save(joinLink);

        return { message: 'Join link revoked successfully' }
    }

    deleteBoardJoinLink = async (joinLinkId: string, boardId: string): Promise<{ message: string }> => {
        const joinLink = await this.boardJoinLinkRepository.findById(joinLinkId);
        if (!joinLink) {
            throw new NotFoundError('Join link not found');
        }
        if (joinLink.boardId !== boardId) {
            throw new BadRequestError('Join link does not belong to the specified board');
        }

        await this.boardJoinLinkRepository.delete(joinLinkId);

        return { message: 'Join link deleted successfully' }
    }

    inviteByEmail = async (boardId: string, data: InviteByEmailDto, inviterId: string): Promise<{ message: string }> => {
        const board = await this.boardRepository.findById(boardId);
        if (!board) {
            throw new NotFoundError('Board not found');
        }

        // TODO: Implement user lookup by email and send invitation email
        // For now, this is a placeholder that would:
        // 1. Look up user by email in the database
        // 2. If user exists, add them directly to the board
        // 3. If user doesn't exist, send an email invitation with a signup link
        // 4. Use an email service (SendGrid, AWS SES, etc.)

        throw new BadRequestError('Email invitation feature is not yet implemented. Please use join links instead.');
    }

    private async validateJoinLink(joinLink: BoardJoinLink): Promise<void> {
        if (new Date() > joinLink.expiresAt) {
            throw new BadRequestError('Join link has expired');
        }
        if (!joinLink.isActive) {
            throw new BadRequestError('Join link is inactive');
        }
        if (joinLink.maxUses && joinLink.usedCount >= joinLink.maxUses) {
            throw new BadRequestError('Join link has reached its maximum uses');
        }
    }
}
