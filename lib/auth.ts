import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getDB } from "./mongodb";

const db = await getDB();

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: false,
      },
      image: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      role: {
        type: "string",
        required: true,
        defaultValue: "user",
      },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
});
