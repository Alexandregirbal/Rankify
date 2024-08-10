export async function GET() {
  return Response.json({ players: ["Homer", "Marge", "Bart", "John"] });
}
