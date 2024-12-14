import { createPlayer } from "@/modules/player/create";
import { getAllPlayersOfActivity } from "@/modules/player/get";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const activityId = url.searchParams.get("activityId");
  if (!activityId) {
    return Response.json({ error: "activityId is required" }, { status: 400 });
  }

  const players = await getAllPlayersOfActivity({ activityId });
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
