"use client";

import { Player } from "@/modules/elo/types";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function AddGame() {
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [player1, setPlayer1] = useState({ name: "", score: 0 });
  const [player2, setPlayer2] = useState({ name: "", score: 0 });
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

  const handleChangePlayer1Name = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setPlayer1({ ...player1, name: value });
  };

  const handleChangePlayer2Name = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setPlayer2({ ...player2, name: value });
  };

  const handleChangePlayer1Score = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPlayer1({ ...player1, score: parseInt(value) });
  };

  const handleChangePlayer2Score = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPlayer2({ ...player2, score: parseInt(value) });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetch("/api/game", {
      method: "POST",
      body: JSON.stringify({ player1, player2 }),
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
    <div className="h-full flex flex-col items-center gap-4 p-4">
      <h1 className="text-center text-2xl">Add a game result</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-4">
            <select
              className="select w-full border border-slate-300 focus:outline-accent"
              onChange={handleChangePlayer1Name}
            >
              <option disabled selected>
                Player 1
              </option>
              {allPlayers.map((player) => (
                <option
                  disabled={player.name === player2.name}
                  key={player.name}
                >
                  {player.name}
                </option>
              ))}
            </select>
            <input
              className="input input-bordered w-full focus:outline-accent"
              type="number"
              name="score"
              defaultValue={player1.score}
              onChange={handleChangePlayer1Score}
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <select
              className="select w-full border border-slate-300 focus:outline-accent"
              onChange={handleChangePlayer2Name}
            >
              <option disabled selected>
                Player 2
              </option>
              {allPlayers.map((player) => (
                <option
                  disabled={player.name === player1.name}
                  key={player.name}
                >
                  {player.name}
                </option>
              ))}
            </select>
            <input
              className="input input-bordered w-full focus:outline-accent"
              type="number"
              name="score"
              defaultValue={player2.score}
              onChange={handleChangePlayer2Score}
            />
          </div>
        </div>
        <button
          disabled={
            !(player1.score !== player2.score && player1.name && player2.name)
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
