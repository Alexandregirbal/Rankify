"use client";

import { HEADER_VARIABLES } from "@/app/constants";
import { DEFAULT_RATING } from "@/modules/elo/constants";
import { Player, PlayerMongo } from "@/modules/player/types";
import { getExtremeRankings } from "@/modules/player/utils";
import { useActivityStore } from "@/stores/activity/provider";
import { type ChartData } from "chart.js";
import "chart.js/auto";
import { ChangeEvent, useState } from "react";
import { Line } from "react-chartjs-2";
import { stringToColor } from "../utils";
import { PlayerQuoteSkeleton, PlayerStatsSkeleton } from "./skeletons";

const NEAREST_MULTIPLE = 50;

type PlayerNameSelect = Player["userName"] | "all";

type RatingHistoriesProps = {
  players: Array<Pick<PlayerMongo, "_id" | "userName" | "ratingHistory">>;
};

export default function RatingHistories({ players }: RatingHistoriesProps) {
  const { selectedActivity } = useActivityStore((state) => state);

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
  const [mostLossesAgainst, setMostLossesAgainst] = useState<{
    name: string;
    count: number;
    totalScore: { for: number; against: number };
  } | null>(null);
  const [mostWinsAgainst, setMostWinsAgainst] = useState<{
    name: string;
    count: number;
    totalScore: { for: number; against: number };
  } | null>(null);
  const [mostFrequentTeammate, setMostFrequentTeammate] = useState<{
    name: string;
    count: number;
  } | null>(null);

  const filterPlayers = (player: RatingHistoriesProps["players"][number]) => {
    return (
      nameInput === "all" ||
      player.userName.toLowerCase().includes(nameInput.toString().toLowerCase())
    );
  };

  const chartDatasets = players.filter(filterPlayers).map((player) => {
    return {
      label: player.userName,
      data: player.ratingHistory.map((rating) => rating.rating),
      fill: false,
      borderColor: stringToColor(player.userName),
      tension: 0.1,
      cubicInterpolationMode: "monotone" as const,
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
      (player) => player.userName === selectedName
    );
    if (!selectedPlayer) return;

    setIsLoading(true);
    const response = await fetch(
      `/api/players/stats?playerId=${selectedPlayer._id}`,
      {
        method: "GET",
        headers: {
          [HEADER_VARIABLES.activityId]: selectedActivity?._id.toString() ?? "",
        },
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
    setMostLossesAgainst(response.mostLossesAgainst);
    setMostWinsAgainst(response.mostWinsAgainst);
    setMostFrequentTeammate(response.mostFrequentTeammate);
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
            <option key={player.userName}>{player.userName}</option>
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
                {mostLossesAgainst && (
                  <li>
                    <span>Most losses:</span>{" "}
                    <span className="font-bold">
                      {mostLossesAgainst.name} ({mostLossesAgainst.count}{" "}
                      losses, {mostLossesAgainst.totalScore.against} -{" "}
                      {mostLossesAgainst.totalScore.for})
                    </span>
                  </li>
                )}
                {mostWinsAgainst && (
                  <li>
                    <span>Most wins:</span>{" "}
                    <span className="font-bold">
                      {mostWinsAgainst.name} ({mostWinsAgainst.count} wins,{" "}
                      {mostWinsAgainst.totalScore.for}-
                      {mostWinsAgainst.totalScore.against})
                    </span>
                  </li>
                )}
                {mostFrequentTeammate && (
                  <li>
                    <span>Most frequent teammate:</span>{" "}
                    <span className="font-bold">
                      {mostFrequentTeammate.name} ({mostFrequentTeammate.count}{" "}
                      games)
                    </span>
                  </li>
                )}
              </>
            )}
          </ul>
        </>
      )}
    </>
  );
}
