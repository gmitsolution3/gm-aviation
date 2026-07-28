"use client";

import { createContext, useContext } from "react";

export const AuthContext = createContext<any>(null);

export const useSession = () => {
  return useContext(AuthContext);
};
