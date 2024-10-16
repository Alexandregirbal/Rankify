import {
  upsertPlayerQuoteOfTheDay,
  upsertQuoteOfTheDay,
} from "@/modules/quote/update";
import { z } from "zod";

const requestBodySchema = z.array(z.string().describe("playerId"));

export async function PUT(request: Request) {
  const requestBody = await request.json();
  console.log(
    `~~~~~ Girbalog | PUT | requestBody: `,
    JSON.stringify(requestBody)
  );

  const requestBodyResult = requestBodySchema.safeParse(requestBody);
  if (!requestBodyResult.success) {
    return Response.json(
      { error: requestBodyResult.error.issues[0].message },
      { status: 400 }
    );
  }

  const playerIds = requestBodyResult.data;

  await Promise.all([
    upsertQuoteOfTheDay(),
    playerIds.map((player) => upsertPlayerQuoteOfTheDay(player)),
  ]);

  return Response.json(
    { message: "Quotes updated successfully" },
    { status: 200 }
  );
}
