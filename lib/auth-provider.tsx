"use client";

import { AuthContext } from "./auth-context";
import { useState } from "react";

export default function AuthProvider({
  children,
  session: initialSession,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [session, setSession] = useState(initialSession);
  return (
    <AuthContext value={{ session, setSession }}>
      {children}
    </AuthContext>
  );
}
