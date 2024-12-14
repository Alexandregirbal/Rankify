import mongooseConnect from "@/database/config/mongoose";
import { userModel } from "./model";
import { UserMongo } from "./types";

export const createUser = async ({
  name,
}: {
  name: string;
}): Promise<UserMongo | null> => {
  await mongooseConnect();

  try {
    const user = await userModel.create({ name });
    return user.toObject();
  } catch (error) {
    return null;
  }
};

export const findOrCreateUser = async ({
  name,
}: {
  name: string;
}): Promise<UserMongo | null> => {
  await mongooseConnect();

  const user = await userModel.findOne({ name });
  if (user) return user.toObject();

  return createUser({ name });
};
