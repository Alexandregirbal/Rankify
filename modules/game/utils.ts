import { MinimalPlayer } from "../player/types";

export const playerToMinimalPlayer = <T extends MinimalPlayer>(
  player: T
): MinimalPlayer => ({
  name: player.name,
  rating: player.rating,
  games: player.games,
});
