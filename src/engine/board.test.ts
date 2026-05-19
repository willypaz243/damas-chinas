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

  // ── HU-A2: Triangle cells ────────────────────────────────

  it("has 6 star points defined", () => {
    expect(HexBoard.STAR_POINTS).toHaveLength(6);
    expect(HexBoard.STAR_POINTS[0].label).toBe("Sur");
    expect(HexBoard.STAR_POINTS[1].label).toBe("Norte");
    expect(HexBoard.STAR_POINTS[2].label).toBe("Noreste");
    expect(HexBoard.STAR_POINTS[3].label).toBe("Suroeste");
    expect(HexBoard.STAR_POINTS[4].label).toBe("Sureste");
    expect(HexBoard.STAR_POINTS[5].label).toBe("Noroeste");
  });

  it("each triangle has exactly 10 cells", () => {
    for (let i = 0; i < 6; i++) {
      expect(HexBoard.getTriangleCells(i)).toHaveLength(10);
    }
  });

  it("all triangle cells are valid positions", () => {
    for (let i = 0; i < 6; i++) {
      const cells = HexBoard.getTriangleCells(i);
      for (const coord of cells) {
        expect(HexBoard.isValidPosition(coord.q, coord.r)).toBe(true);
      }
    }
  });

  it("target zone is the opposite triangle", () => {
    expect(HexBoard.getTargetZone(0)).toEqual(HexBoard.getTriangleCells(1));
    expect(HexBoard.getTargetZone(1)).toEqual(HexBoard.getTriangleCells(0));
    expect(HexBoard.getTargetZone(2)).toEqual(HexBoard.getTriangleCells(3));
    expect(HexBoard.getTargetZone(3)).toEqual(HexBoard.getTriangleCells(2));
    expect(HexBoard.getTargetZone(4)).toEqual(HexBoard.getTriangleCells(5));
    expect(HexBoard.getTargetZone(5)).toEqual(HexBoard.getTriangleCells(4));
  });

  it("getInitialPositions returns same as getTriangleCells", () => {
    for (let i = 0; i < 6; i++) {
      expect(HexBoard.getInitialPositions(i)).toEqual(HexBoard.getTriangleCells(i));
    }
  });
});
