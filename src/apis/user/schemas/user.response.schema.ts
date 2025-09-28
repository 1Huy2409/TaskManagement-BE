import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const UserResponseSchema = z.object({
    id: z.string().openapi({ example: '102230191' }),
    fullname: z.string().openapi({ example: 'Nguyen Huu Nhat Huy' }),
    username: z.string().openapi({ example: '1Huy2409' }),
    email: z.string().openapi({ example: 'nhathuy2409@gmail.com' }),
    googleId: z.string().optional().openapi({ example: 'googleID123' }),
    avatarUrl: z.string().optional().openapi({ example: 'https://avatarurl.com' }),
    isActive: z.boolean().openapi({ example: true }),
    createdAt: z.date(),
    updatedAt: z.date()
})

export const ListUserResponseSchema = z.array(UserResponseSchema)

export type UserResponse = z.infer<typeof UserResponseSchema>
export type ListUserResponse = z.infer<typeof ListUserResponseSchema>