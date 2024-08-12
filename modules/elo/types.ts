export type Player = {
  name: string;
  rating: number;
  ratingHistory: { date: Date; rating: number }[];
  games: number;
};

export type Team = Player[];
