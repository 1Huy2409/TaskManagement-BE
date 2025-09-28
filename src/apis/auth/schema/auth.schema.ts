import z from "zod";
import { extendZodWithOpenApi, ZodRequestBody } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);
export const LoginResponseSchema = z.object({
    accesstoken: z.string().openapi({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" })
})
export const PostLoginSchema = z.object({
    username: z.string().openapi({ example: 'lebao0204' }),
    password: z.string().openapi({ example: 'your_password' })
})
export const PostLogin: ZodRequestBody = {
    description: 'Login form',
    content: {
        'application/json': {
            schema: PostLoginSchema
        }
    }
}