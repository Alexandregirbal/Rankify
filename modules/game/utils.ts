import { MinimalPlayer } from "../player/types";
import { TeamScoring } from "../elo/types";
import { ELIMINATION_FOUL } from "./constants";

export const playerToMinimalPlayer = <T extends MinimalPlayer>(
  player: T
): MinimalPlayer => ({
  _id: player._id,
  name: player.name,
  rating: player.rating,
  games: player.games,
});

export const getEliminationFoul = (teams: TeamScoring[]) => {
  const teamWithEliminationFoul = teams.find((team) =>
    Object.values(ELIMINATION_FOUL).includes(team.eliminationFoul)
  );

  return teamWithEliminationFoul
    ? teamWithEliminationFoul.eliminationFoul
    : null;
};
