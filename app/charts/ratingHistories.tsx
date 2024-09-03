"use client";

import { Player } from "@/modules/elo/types";
import { type ChartData } from "chart.js";
import "chart.js/auto";
import { Line } from "react-chartjs-2";
import { stringToColor } from "./utils";

type RatingHistoriesProps = {
  players: Array<Pick<Player, "name" | "ratingHistory">>;
};

export default function RatingHistories({ players }: RatingHistoriesProps) {
  const chartDatasets = players.map((player) => {
    return {
      label: player.name,
      data: player.ratingHistory.map((rating) => rating.rating),
      fill: false,
      borderColor: stringToColor(player.name),
      tension: 0.1,
    };
  });
  const maxGamesPlayed = Math.max(
    ...players.map((player) => player.ratingHistory.length)
  );
  const chartData: ChartData<"line", number[], string> = {
    labels: Array.from({ length: maxGamesPlayed }, (_, i) => `${i + 1}`),
    datasets: chartDatasets,
  };
  return (
    <Line
      data={chartData}
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
        aspectRatio: 1,
      }}
    />
  );
}
