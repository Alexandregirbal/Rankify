"use client";

import { calculateTeamsExpectations } from "@/modules/elo/expectations";
import { estimateBaseRating } from "@/modules/elo/ratings";
import { TeamScoring } from "@/modules/elo/types";
import { PlayerMongo } from "@/modules/player/types";
import { useUIStore } from "@/stores/ui/provider";
import {
  ChangeEvent,
  FormEventHandler,
  MouseEventHandler,
  useState,
} from "react";

const DEFAULT_TEAM_SCORING: TeamScoring = {
  players: [],
  score: 0,
  eliminationFoul: "",
};
export default function AddGame({ allPlayers }: { allPlayers: PlayerMongo[] }) {
  const [team2, setTeam2] = useState<TeamScoring>(DEFAULT_TEAM_SCORING);
  const [team1, setTeam1] = useState<TeamScoring>(DEFAULT_TEAM_SCORING);
  const { isLoading, setIsLoading } = useUIStore((state) => state);

  const handleChangeTeam1Player = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const { value } = e.target;
    const player = allPlayers.find((p) => p.name === value);
    if (!player) return;

    const newTeam1Players = [...team1.players];
    newTeam1Players[index] = { ...player, playerId: player._id };
    setTeam1({ ...team1, players: newTeam1Players });
  };

  const handleChangeTeam2Player = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const { value } = e.target;
    const player = allPlayers.find((p) => p.name === value);
    if (!player) return;

    const newTeam2Players = [...team2.players];
    newTeam2Players[index] = { ...player, playerId: player._id };
    setTeam2({ ...team2, players: newTeam2Players });
  };

  const handleChangeTeam1Score = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTeam1({ ...team1, score: parseInt(value) });
  };

  const handleChangeTeam2Score = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTeam2({ ...team2, score: parseInt(value) });
  };

  const handleChangeEliminationFouls = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [eliminationFoulType, team] = name.split("-");

    if (team === "team1") {
      setTeam1({
        ...team1,
        score: 0,
        eliminationFoul: checked ? eliminationFoulType : "",
      });
      setTeam2({ ...team2, score: 1, eliminationFoul: "" });
    } else {
      setTeam2({
        ...team2,
        score: 0,
        eliminationFoul: checked ? eliminationFoulType : "",
      });
      setTeam1({ ...team1, score: 1, eliminationFoul: " " });
    }
  };

  const handleReset: MouseEventHandler<HTMLButtonElement> = (e) => {
    setTeam1(DEFAULT_TEAM_SCORING);
    setTeam2(DEFAULT_TEAM_SCORING);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setIsLoading(true);
    fetch("/api/game", {
      method: "POST",
      body: JSON.stringify({ team1, team2 }),
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.href = "/";
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const isSubmitDisabled = !(
    team1.score !== team2.score &&
    team1.players.length &&
    team2.players.length &&
    !isLoading
  );

  const expectations = calculateTeamsExpectations(team1.players, team2.players);
  const baseRating = estimateBaseRating(team1.players, team2.players);

  return (
    <>
      <h1 className="text-center text-2xl">Add a game result</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex w-full justify-evenly">
          <div className="flex flex-col items-center gap-4 w-1/3">
            Team 1
            {new Array(team1.players.length + 1).fill(null).map((_, i) => (
              <select
                className="select w-full border border-slate-300 focus:outline-accent"
                onChange={(e) => handleChangeTeam1Player(e, i)}
                key={i}
                defaultValue={`Player ${i + 1}`}
              >
                <option disabled>Player {i + 1}</option>
                {allPlayers.map((player) => (
                  <option
                    disabled={[...team1.players, ...team2.players]
                      .map((p) => p.name)
                      .includes(player.name)}
                    key={player.name}
                  >
                    {player.name}
                  </option>
                ))}
              </select>
            ))}
          </div>

          <div className="flex flex-col items-center gap-4 w-1/3">
            Team 2
            {new Array(team2.players.length + 1).fill(null).map((_, i) => (
              <select
                className="select w-full border border-slate-300 focus:outline-accent"
                onChange={(e) => handleChangeTeam2Player(e, i)}
                key={i}
                defaultValue={`Player ${i + 1}`}
              >
                <option disabled>Player {i + 1}</option>
                {allPlayers.map((player) => (
                  <option
                    disabled={[...team1.players, ...team2.players]
                      .map((p) => p.name)
                      .includes(player.name)}
                    key={player.name}
                  >
                    {player.name}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        <div
          className="tooltip w-full"
          data-tip={`Pourcentage de chances que l'équipe 1 gagne : ${(
            (expectations?.team1 ?? 0.5) * 100
          ).toFixed(0)} %`}
        >
          <progress
            className="progress progress-accent w-10/12"
            value={(expectations?.team1 ?? 0.5) * 100}
            max="100"
          />
        </div>
        {baseRating ? (
          <>
            <span>{"Points en jeu pour une victoire"}</span>
            <div className="w-full flex flex-row justify-evenly">
              <p>{baseRating.team1wins}</p>
              <p>{baseRating.team2wins}</p>
            </div>
          </>
        ) : (
          ""
        )}

        <div className="collapse collapse-arrow  w-4/5 rounded-md">
          <input type="checkbox" />
          <div className="collapse-title font-medium">
            🎱 - Elimination Fouls
          </div>

          <div className="collapse-content">
            <div className="flex justify-between">
              <div className="form-control flex justify-between flex-col items-center gap-4">
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Black</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    name="black-team1"
                    checked={team1.eliminationFoul === "black"}
                    onChange={handleChangeEliminationFouls}
                  />
                </label>
              </div>

              <div className="form-control flex flex-col items-center gap-4">
                <label className="label cursor-pointer">
                  <span className="label-text mr-2">Black</span>
                  <input
                    type="checkbox"
                    className="checkbox"
                    name="black-team2"
                    checked={team2.eliminationFoul === "black"}
                    onChange={handleChangeEliminationFouls}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-evenly">
          <div className="flex flex-col items-center gap-4">
            <span>Score team 1</span>
            <input
              className="input input-bordered w-1/2 focus:outline-accent"
              type="number"
              name="score"
              value={team1.score}
              onChange={handleChangeTeam1Score}
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <span>Score team 2</span>
            <input
              className="input input-bordered w-1/2 focus:outline-accent"
              type="number"
              name="score"
              value={team2.score}
              onChange={handleChangeTeam2Score}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className="btn btn-outline btn-error"
            type="reset"
            onClick={handleReset}
          >
            Reset
          </button>

          <button
            disabled={isSubmitDisabled}
            type="submit"
            className="btn btn-accent text-white"
          >
            Add
          </button>
        </div>
      </form>
    </>
  );
}
