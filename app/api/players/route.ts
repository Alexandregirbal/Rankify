import { createPlayer } from "@/modules/player/create";
import { getAllPlayers } from "@/modules/player/get";
import { revalidatePath } from "next/cache";

export async function GET() {
  const players = await getAllPlayers();
  return Response.json({ players });
}

export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name) {
    return Response.json({ error: "Name is required" }, { status: 400 });
  }

  const player = await createPlayer(name);
  revalidatePath("/", "layout");

  return Response.json({ player }, { status: 200 });
}
