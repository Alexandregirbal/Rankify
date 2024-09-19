import { TeamScoring } from "../elo/types";
import { ELIMINATION_FOUL } from "./constants";

export const getEliminationFoul = (teams: TeamScoring[]) => {
  const teamWithEliminationFoul = teams.find(
    (team) =>
      team.eliminationFoul &&
      Object.values(ELIMINATION_FOUL).includes(team.eliminationFoul)
  );

  return teamWithEliminationFoul
    ? teamWithEliminationFoul.eliminationFoul
    : null;
};
