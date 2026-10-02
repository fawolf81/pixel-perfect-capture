import { createContext, useContext } from "react";
export type AuthUser = {
  id: string;
  email: string | null;
};

export type AuthState = {
  loading: boolean;
  user: AuthUser | null;
};

export const AuthContext = createContext<AuthState>({ loading: true, user: null });

export function useAuthState() {
  return useContext(AuthContext);
}