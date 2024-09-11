"use client";

import { calculateTeamsExpectations } from "@/modules/elo/expectations";
import { Player, TeamScoring } from "@/modules/elo/types";
import { useUIStore } from "@/stores/ui/provider";
import {
  ChangeEvent,
  FormEventHandler,
  MouseEventHandler,
  useState,
} from "react";

export default function AddGame({ allPlayers }: { allPlayers: Player[] }) {
  const [team2, setTeam2] = useState<TeamScoring>({ players: [], score: 0 });
  const [team1, setTeam1] = useState<TeamScoring>({ players: [], score: 0 });
  const { isLoading, setIsLoading } = useUIStore((state) => state);

  const handleChangeTeam1Player = (
    e: ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const { value } = e.target;
    const player = allPlayers.find((p) => p.name === value);
    if (!player) return;

    const newTeam1Players = [...team1.players];
    newTeam1Players[index] = player;
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
    newTeam2Players[index] = player;
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

  const handleReset: MouseEventHandler<HTMLButtonElement> = (e) => {
    setTeam1({ players: [], score: 0 });
    setTeam2({ players: [], score: 0 });
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
          data-tip={`Expected score of team 1 : ${(
            (expectations?.team1 ?? 0.5) * 100
          ).toFixed(0)} %`}
        >
          <progress
            className="progress progress-accent w-10/12"
            value={(expectations?.team1 ?? 0.5) * 100}
            max="100"
          />
        </div>

        <div className="flex justify-evenly">
          <div className="flex flex-col items-center gap-4">
            <span>Score team 1</span>
            <input
              className="input input-bordered w-1/2 focus:outline-accent"
              type="number"
              name="score"
              defaultValue={team1.score}
              onChange={handleChangeTeam1Score}
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <span>Score team 2</span>
            <input
              className="input input-bordered w-1/2 focus:outline-accent"
              type="number"
              name="score"
              defaultValue={team2.score}
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
