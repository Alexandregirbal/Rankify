import { createPlayer } from "@/modules/player/create";
import { getAllPlayersOfActivity } from "@/modules/player/get";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const activityId = request.headers.get(HEADER_VARIABLES.activityId);
  if (!activityId) {
    return Response.json({ error: "Activity is required" }, { status: 401 });
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
