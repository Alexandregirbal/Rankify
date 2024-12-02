"use client";
import { ChangeEventHandler, FormEventHandler, useState } from "react";

export default function AddPlayer() {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeNewPlayerName: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const { value } = e.target;
    setNewPlayerName(value);
  };

  const handleSubmitNewPlayer: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch("/api/players", {
      method: "POST",
      body: JSON.stringify({ name: newPlayerName.trim() }),
    })
      .then(() => {
        window.location.href = "/";
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmitNewPlayer}
        className="flex items-center gap-4 w-full p-1"
      >
        <input
          className="input input-bordered w-full focus:outline-accent h-12"
          type="text"
          name="name"
          placeholder="Pseudo"
          onChange={handleChangeNewPlayerName}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-outline btn-accent"
        >
          {isLoading ? <span className="loading text-accent"></span> : "Add"}
        </button>
      </form>
    </>
  );
}
