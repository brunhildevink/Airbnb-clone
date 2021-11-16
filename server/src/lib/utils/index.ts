import { Request } from "express";
import { Database, User } from "../types";

export const authorize = async (
  db: Database,
  req: Request
): Promise<User | null> => {
  const token = req.get("X-CSRF-TOKEN");
  const viewer = await db.users.findOne({
    _id: req.signedCookies.viewer,
    token,
  });

  console.log("-------");

  console.log(`client token: ${token}`);

  const test = await db.users.findOne({
    _id: req.signedCookies.viewer,
  });

  console.log(`server token: ${test?.token}`);

  return viewer;
};
