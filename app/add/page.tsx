"use client";

import { Player } from "@/modules/elo/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type TeamScoring = {
  players: Array<Player>;
  score: number;
};

export default function AddGame() {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<TeamScoring>({ players: [], score: 0 });
  const [team1, setTeam1] = useState<TeamScoring>({ players: [], score: 0 });
  const [newPlayerName, setNewPlayerName] = useState("");

  const router = useRouter();

  const handleChangeNewPlayerName = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewPlayerName(value);
  };

  const handleSubmitNewPlayer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/players", {
      method: "POST",
      body: JSON.stringify({ name: newPlayerName }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAllPlayers([...allPlayers, data.player]);
        setNewPlayerName("");
      });
  };

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/game", {
      method: "POST",
      body: JSON.stringify({ team1, team2 }),
    }).then((res) => {
      if (res.status === 200) {
        router.push("/");
      }
    });
  };

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => {
        setAllPlayers(data.players);
      });
  }, []);

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4 overflow-y-scroll">
      <h1 className="text-center text-2xl">Add a game result</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-4">
            Team 1
            {new Array(team1.players.length + 1).fill(null).map((_, i) => (
              <select
                className="select w-full border border-slate-300 focus:outline-accent"
                onChange={(e) => handleChangeTeam1Player(e, i)}
                key={i}
              >
                <option disabled selected>
                  Player {i + 1}
                </option>
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

          <div className="flex flex-col items-center gap-4">
            Team 2
            {new Array(team2.players.length + 1).fill(null).map((_, i) => (
              <select
                className="select w-full border border-slate-300 focus:outline-accent"
                onChange={(e) => handleChangeTeam2Player(e, i)}
                key={i}
              >
                <option disabled selected>
                  Player {i + 1}
                </option>
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

        <div className="flex  items-center gap-4">
          <div className="flex flex-col items-center gap-4">
            Score team 1
            <input
              className="input input-bordered w-1/2 focus:outline-accent"
              type="number"
              name="score"
              defaultValue={team1.score}
              onChange={handleChangeTeam1Score}
            />
          </div>
          <div className="flex flex-col items-center gap-4">
            Score team 2
            <input
              className="input input-bordered w-1/2 focus:outline-accent"
              type="number"
              name="score"
              defaultValue={team2.score}
              onChange={handleChangeTeam2Score}
            />
          </div>
        </div>

        <button
          disabled={
            !(
              team1.score !== team2.score &&
              team1.players.length &&
              team2.players.length
            )
          }
          type="submit"
          className="btn btn-accent text-white"
        >
          Add
        </button>
      </form>

      <div className="divider"></div>

      <h1 className="text-center text-2xl">Add a player</h1>
      <form
        onSubmit={handleSubmitNewPlayer}
        className="flex flex-col items-center gap-4"
      >
        <input
          className="input input-bordered w-full focus:outline-accent"
          type="text"
          name="name"
          placeholder="Player name"
          onChange={handleChangeNewPlayerName}
        />
        <button type="submit" className="btn btn-accent text-white">
          Add
        </button>
      </form>
    </div>
  );
}
