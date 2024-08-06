// https://towardsdatascience.com/developing-an-elo-based-data-driven-ranking-system-for-2v2-multiplayer-games-7689f7d42a53

const DEFAULT_RATING = 1000;

const BASE_K_FACTOR = 20;

const BASE_P_FACTOR = 1;

const POWER = 10;

const THRESHOLD = 400;

type Player = {
  name: string;
  rating: number;
  games: number;
};

/**
 * Commence à K, converge vers K/2.
 * Changer 10 pour faire baisser K plus ou moins vite.
 */
const calculateKFactor = (games: number): number => {
  const result = BASE_K_FACTOR / (1 + 1 / (1 + games / 10));
  return Number(result.toFixed(2));
};

const calculatePFactor = (
  score1: number,
  score2: number,
  minDelta: number = 1
): number => {
  const min = Math.min(score1, score2);
  const max = Math.max(score1, score2);
  const result = max / (min + minDelta);
  return Number(result.toFixed(2));
};

const calculateExpectation = (rating1: number, rating2: number): number => {
  const rating1Expectation =
    1 / (1 + POWER ** ((rating2 - rating1) / THRESHOLD));
  return Number(rating1Expectation.toFixed(4));
};

const calculatePlayersExpectations = (
  player1: Player,
  player2: Player
): {
  player1: number;
  player2: number;
} => {
  return {
    player1: calculateExpectation(player1.rating, player2.rating),
    player2: calculateExpectation(player2.rating, player1.rating),
  };
};

/**
 * Calculates the expected ratings of two teams. The number of players in each team is not important.
 * The number of players in teams can differ (it can be 1v1, 2v1, 3v2 4v4, etc.)
 */
const calculateTeamsExpectations = (
  team1: Player[],
  team2: Player[]
): {
  team1: number;
  team2: number;
} => {
  const team1Rating =
    team1.reduce((acc, cur) => acc + cur.rating, 0) / team1.length;
  const team2Rating =
    team2.reduce((acc, cur) => acc + cur.rating, 0) / team2.length;

  return {
    team1: calculateExpectation(team1Rating, team2Rating),
    team2: calculateExpectation(team2Rating, team1Rating),
  };
};

const calculatePlayersRatings = (
  player: Player,
  team: Player[],
  result: [number, number]
): { rating: number } => {
  const playerKFactor = calculateKFactor(player.games);
  const playerPFactor = calculatePFactor(result[0], result[1]);

  const { team1: playerExpectation, team2: teamExpectation } =
    calculateTeamsExpectations([player], team);
  const win = result[0] > result[1] ? 1 : 0;

  const rating =
    player.rating + playerKFactor * playerPFactor * (win - playerExpectation);
  return {
    rating,
  };
};

// const calculatePlayersRatings =
