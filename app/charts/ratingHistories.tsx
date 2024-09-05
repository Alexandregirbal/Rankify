"use client";

import { DEFAULT_RATING } from "@/modules/elo/constants";
import { Player } from "@/modules/elo/types";
import { getExtremeRankings } from "@/modules/player/utils";
import { type ChartData } from "chart.js";
import "chart.js/auto";
import { ChangeEvent, useState } from "react";
import { Line } from "react-chartjs-2";
import { stringToColor } from "./utils";

type PlayerNameSelect = Pick<Player, "name">["name"] | "all";

type RatingHistoriesProps = {
  players: Array<Pick<Player, "name" | "ratingHistory">>;
};

export default function RatingHistories({ players }: RatingHistoriesProps) {
  const [nameInput, setNameInput] = useState<PlayerNameSelect>("all");
  const [totalNumberOfGamesPlayed, setTotalNumberOfGamesPlayed] = useState(0);
  const [numberOfGamesPlayedToday, setNumberOfGamesPlayedToday] = useState(0);

  const filterPlayers = (player: RatingHistoriesProps["players"][number]) => {
    return (
      nameInput === "all" ||
      player.name.toLowerCase().includes(nameInput.toString().toLowerCase())
    );
  };

  const chartDatasets = players.filter(filterPlayers).map((player) => {
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

  const extremeRatings = players.reduce(
    (acc, currentPlayer) => {
      const { max, min } = getExtremeRankings(currentPlayer.ratingHistory);
      if (acc.max < max) {
        acc.max = max;
      }
      if (acc.min > min) {
        acc.min = min;
      }
      return acc;
    },
    { max: DEFAULT_RATING, min: DEFAULT_RATING }
  );
  const margin = +((extremeRatings.max - extremeRatings.min) / 10).toFixed(0);

  const chartData: ChartData<"line", number[], string> = {
    labels: Array.from({ length: maxGamesPlayed }, (_, i) => `${i}`),
    datasets: chartDatasets,
  };

  const handlePlayerNameChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setNameInput(selectedName);

    if (selectedName === "all") return;

    const response = await fetch(
      `api/players/stats?playerName=${selectedName}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());

    setTotalNumberOfGamesPlayed(response.totalNumberOfGamesPlayed);
    setNumberOfGamesPlayedToday(response.numberOfGamesPlayedToday);
  };

  return (
    <>
      <Line
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: false,
            },
          },
          aspectRatio: 1,
          scales: {
            y: {
              min: Math.floor((extremeRatings.min - margin) / 100) * 100,
              max: Math.ceil((extremeRatings.max + margin) / 100) * 100,
            },
          },
        }}
      />

      <select
        className="w-1/2 select border border-slate-300 focus:outline-accent"
        onChange={handlePlayerNameChange}
      >
        <option value="all">All players</option>
        {players.map((player) => (
          <option key={player.name}>{player.name}</option>
        ))}
      </select>
      {nameInput !== "all" && (
        <p className="text-lg">
          <span className="font-bold">{nameInput}</span> played{" "}
          <span className="font-bold">{numberOfGamesPlayedToday}</span> games
          today (All time:{" "}
          <span className="font-bold">{totalNumberOfGamesPlayed}</span>)
        </p>
      )}
    </>
  );
}
