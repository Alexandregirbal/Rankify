import { Game, Player } from "@/modules/elo/types";

export default function HistoryComponent({
  player,
  games,
}: {
  player: Player;
  games: Array<Game>;
}) {
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

  return (
    <div className="flex rounded-xl items-center gap-4 border bg-neutral-content border-base-300 p-4 w-full">
      <div className="flex justify-between grow">
        {games.map((g) => gameHistory(g))}
      </div>
    </div>
  );
}
