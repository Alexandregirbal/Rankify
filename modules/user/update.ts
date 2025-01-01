import mongooseConnect from "@/database/config/mongoose";
import { userModel } from "./model";
import { UserMongo } from "./types";

export const addUserTrophy = async ({
  userId,
  trophy,
}: {
  userId: UserMongo["_id"];
  trophy: UserMongo["trophies"][number];
}) => {
  await mongooseConnect();

  const updateResult = await userModel.updateOne(
    { _id: userId },
    {
      $push: {
        trophies: trophy,
      },
    }
  );

  return updateResult;
};
