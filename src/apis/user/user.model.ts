import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export type UserResponse = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
    id: z.string().openapi({ example: '102230191' }),
    fullname: z.string().openapi({ example: 'Nguyen Huu Nhat Huy' }),
    username: z.string().openapi({ example: '1Huy2409' }),
    email: z.string().openapi({ example: 'nhathuy2409@gmail.com' }),
    createdAt: z.date(),
    updatedAt: z.date(),
})