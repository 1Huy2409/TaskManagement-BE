import { StatusCodes } from "http-status-codes";
import type { UserResponse } from "./user.model.js";
import { ResponseStatus, ServiceResponse } from "@/common/models/service.response.js";
import type { Repository } from "typeorm";
import { User } from "@/common/entities/user.entity.js";

const transformUserToResponse = (user: User): UserResponse => ({
    id: user.id,
    fullname: user.fullname,
    username: user.username,
    email: user.email,
    createdAt: user.created_at,
    updatedAt: user.updated_at
});

export default class UserService {
    constructor(
        private userRepository: Repository<User>
    ) { }
    async findAll(): Promise<ServiceResponse<UserResponse[] | null>> {
        try {
            const users = await this.userRepository.find();
            if (users.length == 0) {
                return new ServiceResponse(ResponseStatus.Failed, 'Cant found any user', null, StatusCodes.NOT_FOUND);
            }
            const userResponses = users.map(transformUserToResponse);
            return new ServiceResponse(ResponseStatus.Sucess, 'Users found', userResponses, StatusCodes.OK)
        }
        catch (error) {
            const errorMessage = `Error finding all users: $${(error as Error).message}`;
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    async findById(id: string): Promise<ServiceResponse<UserResponse | null>> {
        try {
            const user = await this.userRepository.findOneBy({
                id: id
            })
            if (!user) {
                return new ServiceResponse(ResponseStatus.Failed, `User with ${id} is not found`, null, StatusCodes.NOT_FOUND);
            }
            const userResponse = transformUserToResponse(user);
            return new ServiceResponse(ResponseStatus.Sucess, 'User found', userResponse, StatusCodes.OK)
        }
        catch (error) {
            const errorMessage = `Error finding user by ID: $${(error as Error).message}`;
            return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}