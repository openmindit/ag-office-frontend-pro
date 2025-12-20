import { apiClient } from "./apiClient";
import type { User } from "../types/auth.types";

export const userService = {
  async me(): Promise<User> {
    const { data } = await apiClient.get<User>("/users/me");
    return data;
  },
};
