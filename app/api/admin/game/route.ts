import { rollbackLastGame } from "@/modules/game/update";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const putGameBodySchema = z.object({
  updateType: z.literal("rollback"),
});

export async function PUT(request: Request) {
  const body = await request.json();

  const bodyResult = putGameBodySchema.safeParse(body);
  if (!bodyResult.success) {
    return Response.json({ error: bodyResult.error }, { status: 400 });
  }
  const { updateType } = bodyResult.data;

  const report: Record<string, any> = {};
  switch (updateType) {
    case "rollback":
      const rollbackResult = await rollbackLastGame();
      revalidatePath("/", "layout");
      report.rollback = rollbackResult;
  }

  return Response.json({ report }, { status: 200 });
}
