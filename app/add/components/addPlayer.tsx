import { ChangeEventHandler, FormEventHandler, useState } from "react";

export default function AddPlayer() {
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleChangeNewPlayerName: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const { value } = e.target;
    setNewPlayerName(value);
  };

  const handleSubmitNewPlayer: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    fetch("/api/players", {
      method: "POST",
      body: JSON.stringify({ name: newPlayerName.trim() }),
    }).then(() => {
      window.location.href = "/add";
    });
  };

  return (
    <>
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
    </>
  );
}
