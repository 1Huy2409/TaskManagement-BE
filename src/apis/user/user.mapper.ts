import { User } from "@/common/entities/user.entity";
import type { UserResponse } from "./user.model";

export const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  fullname: user.fullname,
  username: user.username,
  email: user.email,
  createdAt: user.created_at,
  updatedAt: user.updated_at,
});