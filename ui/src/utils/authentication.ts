import type { User } from "@/types";
import { apiRequest } from "@/utils/api-request";

export function createUsernameFromEmail(email: string) {
  const userName = email.split("@")[0];
  const userNamePascalCase = userName.at(0)?.toUpperCase() + userName.slice(1);

  return userNamePascalCase;
}

// Returns the user data if the user is succesfully logged in otherwise null;
// Even when the signIn/register requests are successful, the auth cookie
// may not have been set if the user has a preference set in browser to block
// third-party cookies.
//
// So to ensure that the auth cookie is set, we hit auth/user endpoint. If it
// fails, it will indicate that the auth cookie was not set.
//
// This is a workaround for the current setup where the ui and api are on
// different domains.
export async function verifyLogin(): Promise<User | null> {
  const { success, error, data } = await apiRequest<User | null>({
    endpoint: "/api/auth/user",
  });

  if (!success || data === undefined) {
    throw error;
  }

  return data;
}
