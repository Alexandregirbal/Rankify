"use server";

import HistoryComponent from "@/app/components/player/history";
import RouterBack from "@/app/components/ui/routerBack";
import { getPlayer } from "@/modules/player/get";

export default async function PlayerDetail({
  params,
}: {
  params: Promise<{ playerId: string }>;
}) {
  const { playerId } = await params;
  const player = await getPlayer({ playerId });

  return (
    <div className="h-full w-full background flex flex-col gap-6 py-4 px-6">
      {player ? (
        <>
          <div className="w-full flex flex-row justify-center items-center relative">
            <span className="text-2xl">{player.userName}</span>
            <RouterBack />
          </div>
          <div className="flex-1 overflow-y-scroll">
            <HistoryComponent player={player} />
          </div>
        </>
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <span className="loading loading-spinner text-accent"></span>
        </div>
      )}
    </div>
  );
}
