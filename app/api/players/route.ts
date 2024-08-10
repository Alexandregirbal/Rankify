import { Player } from "@/app/modules/elo/types";

export async function GET() {
  const players: Player[] = [
    { name: "Homer", rating: 100, games: 10 },
    { name: "Marge", rating: 90, games: 5 },
    { name: "Bart", rating: 80, games: 3 },
    { name: "John", rating: 70, games: 2 },
    { name: "Lisa", rating: 71, games: 1 },
    { name: "Maggie", rating: 60, games: 0 },
    { name: "Fred", rating: 30, games: 0 },
    { name: "Barney", rating: 50, games: 0 },
    { name: "Betty", rating: 40, games: 0 },
    { name: "Wilma", rating: 20, games: 0 },
    { name: "José", rating: 10, games: 0 },
  ].sort((p1, p2) => p2.rating - p1.rating);

  return Response.json({ players });
}
