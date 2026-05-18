import { describe, expect, it } from "vitest";
import { HexBoard } from "./board";
import type { HexCoord } from "./types";

describe("HexBoard", () => {
  it("creates 121 valid positions", () => {
    const board = new HexBoard();
    expect(board.getBoard().size).toBe(121);
  });

  it("returns 6 neighbors for the center cell", () => {
    const board = new HexBoard();
    const center: HexCoord = { q: 0, r: 0 };
    const neighbors = board.getNeighbors(center);

    expect(neighbors).toHaveLength(6);
    expect(neighbors).toEqual(
      expect.arrayContaining([
        { q: 1, r: 0 },
        { q: 1, r: -1 },
        { q: 0, r: -1 },
        { q: -1, r: 0 },
        { q: -1, r: 1 },
        { q: 0, r: 1 },
      ]),
    );
  });

  it("rejects invalid coordinates outside the star shape", () => {
    expect(HexBoard.isValidPosition(5, 5)).toBe(false);
    expect(HexBoard.isValidPosition(8, 0)).toBe(false);
    expect(HexBoard.isValidPosition(0, -9)).toBe(false);
    expect(HexBoard.isValidPosition(5, -5)).toBe(false);
  });
});
