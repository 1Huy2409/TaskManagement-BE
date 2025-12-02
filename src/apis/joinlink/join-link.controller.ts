import { Request, Response } from "express";
import { JoinLinkService } from "./join-link.service";
import { AuthFailureError, BadRequestError } from "@/common/handler/error.response";
import { CreateJoinLinkDto, JoinWorkspaceByLinkDto } from "./schemas/join-link.schema";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response";
import { StatusCodes } from "http-status-codes";
import { handleServiceResponse } from "@/common/utils/httpHandler";

export class JoinLinkController {
    constructor(
        private readonly joinLinkService: JoinLinkService
    ) { }

    createJoinLink = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) {
            throw new BadRequestError("Workspace ID is required");
        }
        const userId = req.user ? (req.user as any).id : null;
        if (!userId) {
            throw new AuthFailureError("You 're not authenticated!");
        }
        const data: CreateJoinLinkDto = req.body;
        const joinLink = await this.joinLinkService.createJoinLink(id, userId, data);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            "Join link created successfully",
            joinLink,
            StatusCodes.CREATED
        )
        return handleServiceResponse(serviceResponse, res);
    }

    joinByLink = async (req: Request, res: Response) => {
        const userId = req.user ? req.user.id : null;
        if (!userId) {
            throw new AuthFailureError("You 're not authenticated!");
        }
        const data: JoinWorkspaceByLinkDto = req.body;
        const result = await this.joinLinkService.joinByLink(data.token, userId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            "Successfully joined workspace",
            result,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }

    getWorkspaceJoinLinks = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) {
            throw new BadRequestError("Workspace ID is required");
        }
        const links = await this.joinLinkService.getWorkspaceJoinLinks(id);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            "Workspace join links retrieved successfully",
            links,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }

    revokeJoinLink = async (req: Request, res: Response) => {
        const { workspaceId, linkId } = req.params;
        if (!workspaceId || !linkId) {
            throw new BadRequestError("Workspace ID and Link ID are required");
        }
        const result = await this.joinLinkService.revokeJoinLink(linkId, workspaceId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            "Join link revoked successfully",
            result,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }

    deleteJoinLink = async (req: Request, res: Response) => {
        const { workspaceId, linkId } = req.params;
        if (!workspaceId || !linkId) {
            throw new BadRequestError("Workspace ID and Link ID are required");
        }
        const result = await this.joinLinkService.deleteJoinLink(linkId, workspaceId);
        const serviceResponse = new ServiceResponse(
            ResponseStatus.Sucess,
            "Join link deleted successfully",
            result,
            StatusCodes.OK
        )
        return handleServiceResponse(serviceResponse, res);
    }
}