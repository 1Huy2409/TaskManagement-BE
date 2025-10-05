import { toUserResponse } from './../user.mapper';
import UserService from "../user.service";
import { User } from "@/common/entities/user.entity";
import type { Repository } from "typeorm";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError } from '@/common/handler/error.response';

vi.mock('../user.mapper.ts', () => ({
    toUserResponse: vi.fn((u: any) => ({
        id: u.id,
        fullname: u.fullname,
        username: u.username,
        email: u.email,
        createdAt: u.created_at,
        updatedAt: u.updated_at
    }))
}))


type RepoMockUser = Pick<Repository<User>, 'find' | 'findOneBy'> & {
    find: ReturnType<typeof vi.fn>;
    findOneBy: ReturnType<typeof vi.fn>;
};
describe('User service (TypeORM repository)', () => {
    let mockUserRepository: RepoMockUser
    let userService: UserService
    // mock db  
    const mockUsers: User[] = [
        {
            id: 'b725ecda-c60f-476b-a3b4-957b2b45a40c',
            fullname: 'Vo Van Thai',
            username: 'vanthaitcv2201',
            email: 'vanthai2201@gmail.com',
            googleId: '',
            password: 'password123',
            created_at: new Date('2023-01-01T00:00:00Z'),
            updated_at: new Date('2023-01-01T00:00:00Z'),
        },
        {
            id: 'b725ecda-c60f-476b-a3b4-957b2b45a41c',
            fullname: 'Le Trong Minh Tri',
            username: 'minhtri1407',
            email: 'minhtri1407@gmail.com',
            googleId: '',
            password: 'password123',
            created_at: new Date('2023-01-01T00:00:00Z'),
            updated_at: new Date('2023-01-01T00:00:00Z'),
        }
    ]
    beforeEach(() => {
        vi.clearAllMocks();
        mockUserRepository = {
            find: vi.fn(),
            findOneBy: vi.fn()
        }
        userService = new UserService(mockUserRepository as unknown as Repository<User>)
    })
    describe('findAll', () => {
        // all test case for findAll function here
        it('return all users', async () => {
            // arrange
            mockUserRepository.find.mockResolvedValue(mockUsers)

            // act
            const result = await userService.findAll()

            // assert
            expect(mockUserRepository.find).toHaveBeenCalledTimes(1)
            expect(toUserResponse).toHaveBeenCalledTimes(mockUsers.length)
            const expected = mockUsers.map(u => ({
                id: u.id,
                fullname: u.fullname,
                username: u.username,
                email: u.email,
                createdAt: u.created_at,
                updatedAt: u.updated_at
            }));
            expect(result).toEqual(expected)
        })
        it('return not found error when no user exists', async () => {
            // arrange -> act -> assert
            mockUserRepository.find.mockResolvedValue([])

            const result = userService.findAll()
            await expect(result).rejects.toThrow(NotFoundError)
            await expect(result).rejects.toThrow("Users are not found!")
            expect(mockUserRepository.find).toHaveBeenCalled()

        })
    })
    describe('findByID', () => {
        it('return user by ID', async () => {
            // arrange
            const mockUser = {
                id: 'b725ecda-c60f-476b-a3b4-957b2b45a41c',
                fullname: 'Le Trong Minh Tri',
                username: 'minhtri1407',
                email: 'minhtri1407@gmail.com',
                googleId: '',
                password: 'password123',
                created_at: new Date('2023-01-01T00:00:00Z'),
                updated_at: new Date('2023-01-01T00:00:00Z'),
            }
            mockUserRepository.findOneBy.mockResolvedValue(mockUser)
            // act
            const mockUserID = 'b725ecda-c60f-476b-a3b4-957b2b45a41c'
            const result = await userService.findById(mockUserID)
            // assert
            const expected = toUserResponse(mockUser)
            expect(result).toEqual(expected)
        })
        it('return not found error when user with ID is not found', async () => {
            // arrange
            mockUserRepository.findOneBy.mockResolvedValue(null)
            // act
            const mockUserID = 'b725ecda-c60f-476b-a3b4-957b2b45a42c';
            const result = userService.findById(mockUserID)
            // assert
            await expect(result).rejects.toThrow(NotFoundError)
            await expect(result).rejects.toThrow(`User with ID ${mockUserID} is not found!`)
            expect(mockUserRepository.findOneBy).toHaveBeenCalled()
        })
    })
})