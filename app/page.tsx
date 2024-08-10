import Player from "./components/player";

export default function Leaderboard() {
  const players = [
    { name: "Bart", rating: 80 },
    { name: "Marge", rating: 90 },
    { name: "Maggie", rating: 60 },
    { name: "Homer", rating: 100 },
    { name: "Lisa", rating: 70 },
    { name: "Fred", rating: 30 },
    { name: "Barney", rating: 50 },
    { name: "Betty", rating: 40 },
    { name: "Wilma", rating: 20 },
  ].sort((p1, p2) => p2.rating - p1.rating);

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4">
      <h1 className="text-center text-2xl">Leaderboard</h1>
      {players.map((player, index) => (
        <Player
          key={player.name}
          name={player.name}
          rating={player.rating}
          ranking={index + 1}
        />
      ))}
    </div>
  );
}
