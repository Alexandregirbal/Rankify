import { activityModel } from "@/modules/activity/model";
import { Activity } from "@/modules/activity/types";
import mongooseConnect from "../../database/config/mongoose";

const BASE_ACTIVITIES: Activity[] = [
  {
    name: "8-Ball",
    description: "Le jeu de billard avec lequel on a tout appris.",
  },
  {
    name: "9-Ball",
    description:
      "Un jeu de billard alternatif, réservé au snookers professionels.",
  },
  {
    name: "Chess",
    description: "Les échecs, un incontournable des jeux de stratégie.",
  },
  {
    name: "Ping Pong",
    description: "Pas de place à la chance ici.",
  },
  {
    name: "Babyfoot",
    description: "La tension règne.",
  },
];

export const seedActivities = async () => {
  await mongooseConnect();

  const report = [];
  for (const activity of BASE_ACTIVITIES) {
    const result = await activityModel.updateOne(
      {
        name: activity.name,
      },
      {
        $set: {
          name: activity.name,
          description: activity.description,
        },
      },
      {
        upsert: true,
      }
    );

    report.push({
      activity: activity.name,
      result,
    });
  }

  return report;
};
