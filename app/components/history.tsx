import { Game, Player } from "@/modules/elo/types";
import { getGames } from "@/modules/game/get";
import React from "react";

type propTypes = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  player: Player;
};

const gameHistory = (game: Game) => {
  return (
    <div>
      <div>{game.team1}</div>
      <div>{game.team2}</div>
      <div>{game.scores[0]}</div>
      <div>{game.scores[1]}</div>
      <div>{game.winner}</div>
    </div>
  );
};

export const HistoryComponent: React.FC<propTypes> = async ({ open, onClose, children, player }) => {

  const games = await getGames(player.name);
  return (
    <div
      className={`fixed inset-0 flex justify-center items-center 
    transition-colors ${open ? "visible bg-black/20" : "invisible"}
    `}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow p-6
        transition-all max-w-md 
        ${open ? "scale-100 opacity-100" : "scale-110 opacitiy-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 py-1 px-2 
            border border-neutral-200 rounded-md text-gray-400
            bg-white hover:bg-gray-50 hover:text-gray-600"
          onClick={onClose}
        >
            <div className="flex rounded-xl items-center gap-4 border bg-neutral-content border-base-300 p-4 w-full">
      <div className="flex justify-between grow">
        {games.map((g) => gameHistory(g))}
      </div>
    </div>
        </button>
        {children}
      </div>
    </div>
  );
};

export default HistoryComponent;