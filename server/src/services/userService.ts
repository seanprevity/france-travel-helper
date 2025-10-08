import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";

export const getUserByCognitoId = async (cognitoId: string) => {
  return await db.query.users.findFirst({
    where: eq(users.cognitoId, cognitoId),
  });
};

export const createUserQuery = async (
  cognitoId: string,
  username: string,
  email: string
) => {
  const [newUser] = await db
    .insert(users)
    .values({ cognitoId, username, email })
    .returning();

  return newUser;
};

export const updateUserByCognitoId = async (
  cognitoId: string,
  updates: { username?: string; email?: string }
) => {
  const updatedUsers = await db
    .update(users)
    .set(updates)
    .where(eq(users.cognitoId, cognitoId))
    .returning();

  return updatedUsers;
};
