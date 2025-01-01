import { HEADER_VARIABLES } from "@/app/constants";
import { zodObjectId } from "@/database/utils";
import { createPlayer } from "@/modules/player/create";
import { getAllPlayersOfActivity } from "@/modules/player/get";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function GET(request: Request) {
  const activityId = request.headers.get(HEADER_VARIABLES.activityId);
  if (!activityId) {
    return Response.json({ error: "Activity is required" }, { status: 401 });
  }

  const players = await getAllPlayersOfActivity({ activityId });
  return Response.json({ players });
}

const addNewPlayerSchema = z.object({
  name: z.string().transform((val) => val.trim()),
  activityId: zodObjectId,
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsedBody = addNewPlayerSchema.safeParse(body);
  if (!parsedBody.success) {
    return Response.json(
      { error: "Valid name and activity are required" },
      { status: 400 }
    );
  }

  const { name, activityId } = parsedBody.data;

  const player = await createPlayer({
    userName: name,
    activityId,
  });
  revalidatePath("/", "layout");

  return Response.json({ player }, { status: 200 });
}
