import { HEADER_VARIABLES } from "@/app/constants";
import { getEnvConfigs } from "@/envConfig";
import { rollbackLastGame } from "@/modules/game/update";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const putGameBodySchema = z.object({
  updateType: z.literal("rollback"),
});

export async function PUT(request: Request) {
  const adminToken = request.headers.get(HEADER_VARIABLES.adminToken);
  if (!adminToken || adminToken !== getEnvConfigs().ADMIN_TOKEN) {
    return Response.json({ error: "Invalid admin token" }, { status: 401 });
  }

  const activityId = request.headers.get(HEADER_VARIABLES.activityId);
  if (!activityId) {
    return Response.json({ error: "Activity is required" }, { status: 401 });
  }

  const body = await request.json();

  const bodyResult = putGameBodySchema.safeParse(body);
  if (!bodyResult.success) {
    return Response.json({ error: bodyResult.error }, { status: 400 });
  }
  const { updateType } = bodyResult.data;

  const report: Record<string, any> = {};
  switch (updateType) {
    case "rollback":
      const rollbackResult = await rollbackLastGame({ activityId });

      revalidatePath("/", "layout");
      report.rollback = rollbackResult;
  }

  return Response.json({ report }, { status: 200 });
}
