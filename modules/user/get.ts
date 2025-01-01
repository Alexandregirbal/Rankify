import mongooseConnect from "@/database/config/mongoose";
import { userModel } from "./model";
import { UserMongo } from "./types";

export const getAllUsers = async (): Promise<Array<UserMongo>> => {
  await mongooseConnect();
  const users = await userModel.find().exec();
  return users.map((user) => user.toObject());
};

/**
 * Get user by its id or name
 */
export const getUser = async ({
  userId,
  userName,
}: {
  userId?: UserMongo["_id"];
  userName?: UserMongo["name"];
}): Promise<UserMongo | null> => {
  await mongooseConnect();

  const user = await userModel
    .findOne({
      ...(userId && { _id: userId }),
      ...(userName && { name: userName }),
    })
    .exec();

  if (!user) return null;

  return user.toObject();
};
