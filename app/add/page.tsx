"use server";

import { getAllPlayers } from "@/modules/player/get";
import AddGame from "./components/addGame";

export default async function AddPage() {
  const allPlayers = await getAllPlayers();

  return (
    <div className="h-full w-full px-4 flex flex-col items-center gap-4 p-4 overflow-y-scroll bg-gray-950">
      <AddGame
        allPlayers={allPlayers.sort((a, b) => (a.name > b.name ? 1 : -1))}
      />
    </div>
  );
}
