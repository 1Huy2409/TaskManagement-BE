import { User } from "@/common/entities/user.entity";
import { vi, describe } from "vitest";
import { app } from "@/index";

describe('Users API Endpoints', () => {
    // mock users
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
    // mock user service
})