import { getPlayer } from "@/modules/player/get";

export async function GET(request: Request, { params: { id } }: { params: { id: string } }) {
    const playerId = id.split("=").slice(-1).join();
    const player = await getPlayer({ playerId });

    return Response.json(player);
}