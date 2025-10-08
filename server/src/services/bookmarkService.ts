import { bookmarks, cities } from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";
import { db } from "../lib/db";

// uses raw SQL because bookmarks-cities relation is not working
export const getBookmarksByUserId = async (userId: number) => {
  return await db
    .select()
    .from(bookmarks)
    .innerJoin(cities, eq(bookmarks.inseeCode, cities.codeInsee))
    .where(eq(bookmarks.userId, userId));
};

export const addBookmarkService = async (userId: number, inseeCode: string) => {
  return await db.insert(bookmarks).values({
    userId: userId,
    inseeCode: inseeCode,
  });
};

export const deleteBookmarkService = async (
  userId: number,
  inseeCode: string
) => {
  return await db
    .delete(bookmarks)
    .where(
      and(eq(bookmarks.userId, userId), eq(bookmarks.inseeCode, inseeCode))
    );
};

export const checkBookmarkService = async (
  userId: number,
  insee: string
) => {
  const res = await db.select().from(bookmarks).where(and(eq(bookmarks.inseeCode, insee), eq(bookmarks.userId, userId)));
  if (res.length == 0 ) return false;
  return true;
}
