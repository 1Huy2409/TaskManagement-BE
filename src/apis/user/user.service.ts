import { UserResponse } from "./schemas";
import type { Repository } from "typeorm";
// import { User } from "@/common/entities/user.entity";
// import { NotFoundError } from "@/common/handler/error.response";
import { User } from "@/common/entities/user.entity";
import { NotFoundError } from "@/common/handler/error.response";
import { toUserResponse } from "./user.mapper";
import { IUserRepository } from "./repositories/user.repository.interface";

export default class UserService {
    constructor(
        private userRepository: IUserRepository
    ) {
    }
    findAll = async (): Promise<UserResponse[]> => {
        const users = await this.userRepository.findAll();
        if (!users.length) {
            throw new NotFoundError('Users are not found!')
        }
        return users.map(toUserResponse)
    }
    findById = async (id: string): Promise<UserResponse | null> => {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError(`User with ID ${id} is not found!`)
        }
        return toUserResponse(user)
    }
}