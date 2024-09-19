"use client";

import { DEFAULT_RATING } from "@/modules/elo/constants";
import { Player, PlayerMongo } from "@/modules/player/types";
import { getExtremeRankings } from "@/modules/player/utils";
import { type ChartData } from "chart.js";
import "chart.js/auto";
import { ChangeEvent, useState } from "react";
import { Line } from "react-chartjs-2";
import { stringToColor } from "../utils";
import { PlayerQuoteSkeleton, PlayerStatsSkeleton } from "./skeletons";

const NEAREST_MULTIPLE = 50;

type PlayerNameSelect = Player["name"] | "all";

type RatingHistoriesProps = {
  players: Array<Pick<PlayerMongo, "_id" | "name" | "ratingHistory">>;
};

export default function RatingHistories({ players }: RatingHistoriesProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [nameInput, setNameInput] = useState<PlayerNameSelect>("all");
  const [totalNumberOfGamesPlayed, setTotalNumberOfGamesPlayed] = useState(0);
  const [numberOfGamesPlayedToday, setNumberOfGamesPlayedToday] = useState(0);
  const [winLossRatio, setWinLossRatio] = useState(0);
  const [extremeStreaks, setExtremeStreaks] = useState({
    win: 0,
    loss: 0,
  });
  const [playerQuote, setPlayerQuote] = useState("");

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

  const chartData: ChartData<"line", number[], string> = {
    labels: Array.from({ length: maxGamesPlayed }, (_, i) => `${i}`),
    datasets: chartDatasets,
  };

  const handlePlayerNameChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setNameInput(selectedName);

    if (selectedName === "all") return;

    const selectedPlayer = players.find(
      (player) => player.name === selectedName
    );
    if (!selectedPlayer) return;

    setIsLoading(true);
    const response = await fetch(
      `api/players/stats?playerId=${selectedPlayer._id}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());

    if (response.error) {
      setIsLoading(false);
      return;
    }

    setTotalNumberOfGamesPlayed(response.totalNumberOfGamesPlayed);
    setNumberOfGamesPlayedToday(response.numberOfGamesPlayedToday);
    setWinLossRatio(response.winLossRatio);
    setExtremeStreaks(response.extremeStreaks);
    setPlayerQuote(response.playerQuote);
    setIsLoading(false);
  };

  const resetPlayerName = () => {
    setNameInput("all");
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
          aspectRatio: 1.2,
          scales: {
            y: {
              min:
                Math.floor(extremeRatings.min / NEAREST_MULTIPLE) *
                NEAREST_MULTIPLE,
              max:
                Math.ceil(extremeRatings.max / NEAREST_MULTIPLE) *
                NEAREST_MULTIPLE,
            },
          },
        }}
      />
      <div className="w-full flex gap-4 justify-center">
        <select
          className="w-2/5 select border border-slate-300 focus:outline-accent"
          onChange={handlePlayerNameChange}
          value={nameInput}
        >
          <option value="all" className="text-error">
            All players
          </option>
          {players.map((player) => (
            <option key={player.name}>{player.name}</option>
          ))}
        </select>
        <button className="btn btn-outline btn-error" onClick={resetPlayerName}>
          ✕
        </button>
      </div>

      {nameInput !== "all" && (
        <>
          <h2 className="text-2xl">{`${nameInput}'s stats`}</h2>
          {isLoading ? (
            <PlayerQuoteSkeleton />
          ) : (
            <p className="text-center w-full">{playerQuote}</p>
          )}
          <ul className="text-lg text-left w-full">
            <li>
              <span>Current rating:</span>{" "}
              <span className="font-bold">
                {chartDatasets[0].data[chartDatasets[0].data.length - 1]}
              </span>
            </li>
            {isLoading ? (
              <PlayerStatsSkeleton />
            ) : (
              <>
                <li>
                  <span>Games played:</span>{" "}
                  <span className="font-bold">{totalNumberOfGamesPlayed}</span>
                </li>
                <li>
                  <span>Games played today:</span>{" "}
                  <span className="font-bold">{numberOfGamesPlayedToday}</span>
                </li>
                <li>
                  <span>Win/Loss ratio:</span>{" "}
                  <span className="font-bold">
                    {(winLossRatio * 100).toFixed(0)}%
                  </span>
                </li>
                <li>
                  <span>Best win streak:</span>{" "}
                  <span className="font-bold">{extremeStreaks.win}</span>
                </li>
                <li>
                  <span>Worst loss streak:</span>{" "}
                  <span className="font-bold">{extremeStreaks.loss}</span>
                </li>
              </>
            )}
          </ul>
        </>
      )}
    </>
  );
}
