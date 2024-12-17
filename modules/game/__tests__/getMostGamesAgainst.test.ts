import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { getMostGamesAgainst } from "../get";
import { gameModel } from "../model";
import { MOCK_GAMES } from "./mocks/games.mock";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await gameModel.insertMany(MOCK_GAMES);
});

afterEach(async () => {
  await gameModel.deleteMany({});
});

describe("getMostGamesAgainst", () => {
  it("should return the opponent with most wins against", async () => {
    const playerId = "66fd3cba42d4c012ac8621d9"; // Clément's ID
    const result = await getMostGamesAgainst(playerId, "wins");

    expect(result).toEqual({
      name: "Rémi",
      count: 3,
      totalScore: {
        for: 3,
        against: 1,
      },
    });
  });

  it("should return the opponent with most losses against", async () => {
    const playerId = "66fd3cce42d4c012ac8621ed"; // Jean's ID
    const result = await getMostGamesAgainst(playerId, "losses");

    expect(result).toEqual({
      name: "Clément",
      count: 3,
      totalScore: {
        for: 3,
        against: 0,
      },
    });
  });

  it("should return null if no games are found", async () => {
    const playerId = "66fd3ccc42d4c012ac8621ec"; // Non-existent player ID
    const result = await getMostGamesAgainst(playerId, "wins");

    expect(result).toBeNull();
  });

  it("should handle players with equal number of games against", async () => {
    const playerId = "66fd3cbd42d4c012ac8621de"; // Simon's ID
    const result = await getMostGamesAgainst(playerId, "losses");

    // Simon has lost twice, once to Clément and once to Rémi
    // The function should return one of them (the first in the sorted order)
    expect(result).toMatchObject({
      count: 2,
      totalScore: {
        for: 2,
        against: 2,
      },
    });
    expect(result?.name).toMatch(/^(Clément|Rémi)$/);
  });
});
