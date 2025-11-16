import { z } from 'zod';
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateUserSchema = z.object({
    fullname: z.string().min(5).max(255).openapi({ example: 'Nguyen Huu Nhat Huy' }),
    username: z.string().min(3).max(100).openapi({ example: '1Huy2409' }),
    email: z.string().openapi({ example: 'nhathuy2409@gmail.com' }),
    password: z.string().min(6).openapi({ example: 'password123' }),
})

export const PostUserRequest: ZodRequestBody = {
    description: 'Create new user',
    content: {
        'application/json': {
            schema: CreateUserSchema
        }
    }
}

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true })
    .extend({
        avatarUrl: z.string().optional().openapi({ example: 'https://avatarurl456.com' }),
        isActive: z.boolean().optional().openapi({ example: true })
    })
export const PatchUserRequest: ZodRequestBody = {
    description: 'Update user',
    content: {
        'application/json': {
            schema: UpdateUserSchema
        }
    }
}

// Update personal profile info (name, birthday, email, description)
export const UpdateUserProfileSchema = z.object({
    fullname: z.string().min(1).max(255).optional().openapi({ example: 'Nguyen Van A' }),

    description: z.string().max(2000).optional().openapi({ example: 'About me' }),
});

export const PatchUserProfileRequest: ZodRequestBody = {
    description: 'Update user personal profile info',
    content: {
        'application/json': {
            schema: UpdateUserProfileSchema
        }
    }
}

// Upload avatar (multipart/form-data)
export const UploadAvatarSchema = z.object({
    avatar: z.string().openapi({
        type: 'string',
        format: 'binary',
        example: 'binary image file'
    })
});

export const UploadAvatarRequest: ZodRequestBody = {
    description: 'Upload user avatar (multipart/form-data)',
    content: {
        'multipart/form-data': {
            schema: UploadAvatarSchema
        }
    }
}

export type PostUserRequest = z.infer<typeof CreateUserSchema>
export type PatchUserRequest = z.infer<typeof UpdateUserSchema>
export type PatchUserProfileRequest = z.infer<typeof UpdateUserProfileSchema>
export type UploadAvatarRequestType = z.infer<typeof UploadAvatarSchema>
