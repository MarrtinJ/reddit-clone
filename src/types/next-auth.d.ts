import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    usernaem?: string | null;
  }
}
declare module "next-auth" {
  interface Session {
    id: UserId;
    usernaem?: string | null;
  }
}
