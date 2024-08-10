"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

export default function AddGame() {
  const [allPlayers, setAllPlayers] = useState<string[]>([]);
  const [player1, setPlayer1] = useState({ name: "", score: 0 });
  const [player2, setPlayer2] = useState({ name: "", score: 0 });

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
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
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
              className="select w-full"
              onChange={handleChangePlayer1Name}
            >
              <option disabled selected>
                Player 1
              </option>
              {allPlayers.map((player) => (
                <option disabled={player === player2.name} key={player}>
                  {player}
                </option>
              ))}
            </select>
            <input
              className="input input-bordered w-full"
              type="number"
              name="score"
              placeholder="Score player 1"
              onChange={handleChangePlayer1Score}
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <select
              className="select w-full"
              onChange={handleChangePlayer2Name}
            >
              <option disabled selected>
                Player 2
              </option>
              {allPlayers.map((player) => (
                <option disabled={player === player1.name} key={player}>
                  {player}
                </option>
              ))}
            </select>
            <input
              className="input input-bordered  w-full"
              type="number"
              name="score"
              placeholder="Score player 2"
              onChange={handleChangePlayer2Score}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-accent text-white">
          Add
        </button>
      </form>
    </div>
  );
}
