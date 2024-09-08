import { Player } from "@/modules/elo/types";
import { describe, expect, it } from "vitest";
import { calculatePlayerStreak, getExtremPlayerStreak } from "../utils";

describe("calculatePlayerStreak", () => {
  it("should return default result if rating history is empty", () => {
    const ratingHistory: Player["ratingHistory"] = [];
    const result = calculatePlayerStreak({ ratingHistory });
    expect(result).toEqual({ result: "tie", count: 0 });
  });

  it("should return default result if rating history has only one item", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date() },
    ];
    const result = calculatePlayerStreak({ ratingHistory });
    expect(result).toEqual({ result: "tie", count: 0 });
  });

  it("should return tie if the last two ratings are equal", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date() },
      { rating: 1000, date: new Date() },
    ];
    const result = calculatePlayerStreak({ ratingHistory });
    expect(result).toEqual({ result: "tie", count: 1 });
  });

  it("should return win if the previous rating is higher than the current rating", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date() },
      { rating: 950, date: new Date() },
    ];
    const result = calculatePlayerStreak({ ratingHistory });
    expect(result).toEqual({ result: "loss", count: 1 });
  });

  it("should return loss if the previous rating is lower than the current rating", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 950, date: new Date() },
      { rating: 1000, date: new Date() },
    ];
    const result = calculatePlayerStreak({ ratingHistory });
    expect(result).toEqual({ result: "win", count: 1 });
  });

  it("should count streak correctly over multiple games with same result", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date() },
      { rating: 980, date: new Date() },
      { rating: 950, date: new Date() },
      { rating: 900, date: new Date() },
    ];
    const result = calculatePlayerStreak({ ratingHistory });
    expect(result).toEqual({ result: "loss", count: 3 });
  });

  it("should detect loss streak correctly over multiple games history", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date(2020) },
      { rating: 950, date: new Date(2021) },
      { rating: 1000, date: new Date(2022) },
      { rating: 900, date: new Date(2022) },
    ];
    const result = calculatePlayerStreak({
      ratingHistory,
    });
    expect(result).toEqual({ result: "loss", count: 1 });
  });

  it("should detect win streak correctly over multiple games history", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date(2020) },
      { rating: 950, date: new Date(2021) },
      { rating: 1000, date: new Date(2022) },
      { rating: 900, date: new Date(2022) },
      { rating: 1100, date: new Date(2022) },
      { rating: 1500, date: new Date(2022) },
    ];
    const result = calculatePlayerStreak({
      ratingHistory,
    });
    expect(result).toEqual({ result: "win", count: 2 });
  });

  it("should detect high streak correctly ", () => {
    // only loss
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date() },
      { rating: 950, date: new Date() },
      { rating: 900, date: new Date() },
      { rating: 850, date: new Date() },
      { rating: 800, date: new Date() },
      { rating: 750, date: new Date() },
      { rating: 700, date: new Date() },
      { rating: 650, date: new Date() },
      { rating: 600, date: new Date() },
      { rating: 550, date: new Date() },
      { rating: 500, date: new Date() },
      { rating: 450, date: new Date() },
      { rating: 400, date: new Date() },
      { rating: 350, date: new Date() },
      { rating: 300, date: new Date() },
    ];
    const result = calculatePlayerStreak({
      ratingHistory,
    });
    expect(result).toEqual({ result: "loss", count: ratingHistory.length - 1 });
  });
});

describe("getExtremPlayerStreak", () => {
  it("should return 0 for a player with only one game played", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date() },
    ];
    const result = getExtremPlayerStreak({ ratingHistory });
    expect(result).toEqual({ win: 0, loss: 0 });
  });

  it("should match one loss", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date() },
      { rating: 900, date: new Date() },
    ];
    const result = getExtremPlayerStreak({ ratingHistory });
    expect(result).toEqual({ win: 0, loss: 1 });
  });

  it("should match one win", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date() },
      { rating: 1100, date: new Date() },
    ];
    const result = getExtremPlayerStreak({ ratingHistory });
    expect(result).toEqual({ win: 1, loss: 0 });
  });

  it("should return multiple wins", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 950, date: new Date() },
      { rating: 1000, date: new Date() },
      { rating: 1050, date: new Date() },
    ];
    const result = getExtremPlayerStreak({ ratingHistory });
    expect(result).toEqual({ win: 2, loss: 0 });
  });

  it("should return multiple losses and a win", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 1000, date: new Date() },
      { rating: 1050, date: new Date() },
      { rating: 1000, date: new Date() },
      { rating: 950, date: new Date() },
    ];
    const result = getExtremPlayerStreak({ ratingHistory });
    expect(result).toEqual({ win: 1, loss: 2 });
  });

  it("should match a complex history", () => {
    const ratingHistory: Player["ratingHistory"] = [
      { rating: 950, date: new Date() },
      { rating: 900, date: new Date() },
      { rating: 800, date: new Date() },
      { rating: 850, date: new Date() },
      { rating: 900, date: new Date() },
      { rating: 1000, date: new Date() },
      { rating: 1100, date: new Date() },
      { rating: 1200, date: new Date() },
      { rating: 1300, date: new Date() },
      { rating: 1400, date: new Date() },
      { rating: 1500, date: new Date() },
      { rating: 1600, date: new Date() },
      { rating: 1700, date: new Date() },
      { rating: 1600, date: new Date() },
      { rating: 1500, date: new Date() },
      { rating: 1400, date: new Date() },
      { rating: 1300, date: new Date() },
      { rating: 1200, date: new Date() },
      { rating: 1300, date: new Date() },
      { rating: 1400, date: new Date() },
    ];
    const result = getExtremPlayerStreak({ ratingHistory });
    expect(result).toEqual({ win: 10, loss: 5 });
  });
});
