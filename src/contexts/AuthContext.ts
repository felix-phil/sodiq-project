import React from "react";

export interface AuthContextType {
  user?: {
    id: string;
    fullName: string;
    email: string;
    image?: string;
    role: "student" | "lecturer" | "admin";
  };
  login: (user: {
    id: string;
    fullName: string;
    email: string;
    image?: string;
    role: "student" | "lecturer" | "admin";
  }) => void;
  logout: () => void;
}
const AuthContext = React.createContext<AuthContextType>({
  user: undefined,
  login: () => {},
  logout: () => {},
});
export default AuthContext;
