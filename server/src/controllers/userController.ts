import { Request, Response } from "express";
import {
  getUserByCognitoId,
  createUserQuery,
  updateUserByCognitoId,
} from "../services/userService";

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const user = await getUserByCognitoId(cognitoId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: `Error retrieving user: ${error.message}`,
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId, username, email } = req.body;
    console.log(cognitoId, username, email);
    const newUser = await createUserQuery(cognitoId, username, email);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(500).json({
      message: `Error creating user: ${error.message}`,
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cognitoId } = req.params;
    const { username, email } = req.body;

    const updated = await updateUserByCognitoId(cognitoId, {
      username,
      email,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({
      message: `Error updating user: ${error.message}`,
    });
  }
};
