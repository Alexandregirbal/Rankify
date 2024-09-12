"use server";

import { getAllPlayers } from "@/modules/player/get";
import AddGame from "./components/addGame";

export default async function AddPage() {
  const allPlayers = await getAllPlayers();

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4 overflow-y-scroll">
      <AddGame allPlayers={allPlayers} />
    </div>
  );
}
