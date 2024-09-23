import mongooseConnect from "@/database/config/mongoose";
import dayjs from "dayjs";
import { seasonModel } from "./model";
import { SeasonMongo } from "./types";

export const startNewSeason = async ({
  number,
}: {
  number?: number;
}): Promise<SeasonMongo | null> => {
  await mongooseConnect();

  const today = dayjs().startOf("day");
  const endSeasonDate = today.add(3, "month").startOf("month");

  const newSeason = await seasonModel.create({
    number,
    startDate: today.toDate(),
    endDate: endSeasonDate.toDate(),
    state: "active",
  });

  return newSeason;
};
