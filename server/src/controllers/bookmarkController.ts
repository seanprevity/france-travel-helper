import { Request, Response } from "express";
import {
  getBookmarksByUserId,
  addBookmarkService,
  deleteBookmarkService,
  checkBookmarkService
} from "../services/bookmarkService";
import { getUserByCognitoId } from "../services/userService";

export const getBookmarks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const user = await getUserByCognitoId(cognitoId);
    const bookmarks = await getBookmarksByUserId(Number(user?.userId));

    res.json(bookmarks);
  } catch (error: any) {
    console.error("❌ Error retrieving bookmarks:", error);
    res.status(500).json({
      message: `Error retrieving user: ${error.message}`,
    });
  }
};

export const createBookmark = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const user = await getUserByCognitoId(cognitoId);
    const { inseeCode } = req.body;
    console.log(`Insee Code: ${inseeCode}`);
    await addBookmarkService(Number(user?.userId), inseeCode);
    res.status(201).json({ message: "Bookmark created successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: `Error adding bookmark: ${error.message}`,
    });
  }
};

export const deleteBookmark = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const user = await getUserByCognitoId(cognitoId);
    const { inseeCode } = req.body;
    console.log(`Insee Code: ${inseeCode}`);
    await deleteBookmarkService(Number(user?.userId), inseeCode);
    res.status(200).json({ message: "Bookmark deleted successfully" });
  } catch (error: any) {
    res.status(500).json({
      message: `Error deleting bookmark: ${error.message}`,
    });
  }
};

export const checkBookmark = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, insee } = req.params;
    const val = await checkBookmarkService(Number(userId), insee);
    res.json(val);
  } catch (error: any) {
    res.status(500).json({ message: `Error checking bookmark: ${error.message}`});
  }
}
