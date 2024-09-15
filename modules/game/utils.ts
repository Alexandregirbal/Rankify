import { MinimalPlayer } from "../player/types";

export const playerToMinimalPlayer = <T extends MinimalPlayer>(
  player: T
): MinimalPlayer => ({
  _id: player._id,
  name: player.name,
  rating: player.rating,
  games: player.games,
});
