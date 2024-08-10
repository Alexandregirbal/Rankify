import { createPlayer } from "@/app/modules/player/create";
import { getAllPlayers, getPlayer } from "@/app/modules/player/get";

export async function GET() {
  const players = await getAllPlayers();

  return Response.json({ players });
}

export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }
  await createPlayer(name);
  const player = await getPlayer(name);

  return Response.json({ player }, { status: 200 });
}
