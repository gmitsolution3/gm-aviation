import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { auth } from "./auth";

const baseURL =
  process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_AUTH_DEV_BASE_URL
    : process.env.NEXT_PUBLIC_AUTH_BASE_URL;

export const authClient = createAuthClient({
  baseURL: `${baseURL}/api/auth`,
  plugins: [
    inferAdditionalFields<typeof auth>(),
  ],
});
