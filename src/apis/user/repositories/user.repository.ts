import type { IUserRepository } from "@/apis/user/repositories/user.repository.interface";
import { User } from "@/common/entities/user.entity";
import { Repository } from "typeorm";
export class UserRepository implements IUserRepository {
    constructor(
        private readonly userRepository: Repository<User>
    ) { }
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findByUsername(username: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { username } });
    }

    async findById(id: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async create(data: Partial<User>): Promise<User> {
        const user = this.userRepository.create(data);
        return await this.userRepository.save(user);
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        return await this.userRepository.save({ ...data, id } as User);
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}