import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types/api.types";

interface AuthState {
  user: User | null;
  token: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  permissionsLoaded: boolean;

  login: (user: User, token: string, permissions: string[]) => void;
  logout: () => void;
  setPermissions: (permissions: string[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      permissions: [],
      isAuthenticated: false,
      permissionsLoaded: false,

      login: (user, token, permissions) => {
        set({
          user,
          token,
          permissions,
          isAuthenticated: true,
          permissionsLoaded: true,
        });
      },

      setPermissions: (permissions) => {
        set({ permissions, permissionsLoaded: true });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          permissions: [],
          isAuthenticated: false,
          permissionsLoaded: false,
        });
        localStorage.removeItem("access_token");
      },
    }),
    {
      name: "ag-office-auth", // clé localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
