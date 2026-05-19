import type { Cell, HexCoord, PlayerPoint } from "./types";

export class HexBoard {
  private board: Map<string, Cell>;

  static readonly DIRECTIONS: HexCoord[] = [
    { q: 1, r: 0 },
    { q: 1, r: -1 },
    { q: 0, r: -1 },
    { q: -1, r: 0 },
    { q: -1, r: 1 },
    { q: 0, r: 1 },
  ];

  static readonly STAR_POINTS: PlayerPoint[] = [
    { id: 0, label: "Sur", coord: { q: 0, r: -2 } },
    { id: 1, label: "Norte", coord: { q: 0, r: 2 } },
    { id: 2, label: "Noreste", coord: { q: 2, r: 0 } },
    { id: 3, label: "Suroeste", coord: { q: -2, r: 0 } },
    { id: 4, label: "Sureste", coord: { q: 2, r: -3 } },
    { id: 5, label: "Noroeste", coord: { q: -2, r: 3 } },
  ];

  private static readonly TRIANGLE_CELLS: HexCoord[][] = [
    [
      { q: 0, r: -4 }, { q: 1, r: -4 }, { q: 2, r: -4 }, { q: 3, r: -4 }, { q: 4, r: -4 },
      { q: 0, r: -3 }, { q: 1, r: -3 }, { q: 2, r: -3 }, { q: 3, r: -3 },
      { q: 0, r: -2 },
    ],
    [
      { q: 0, r: 4 }, { q: -1, r: 4 }, { q: -2, r: 4 }, { q: -3, r: 4 }, { q: -4, r: 4 },
      { q: 0, r: 3 }, { q: -1, r: 3 }, { q: -2, r: 3 }, { q: -3, r: 3 },
      { q: 0, r: 2 },
    ],
    [
      { q: 4, r: 0 }, { q: 4, r: -1 }, { q: 4, r: -2 }, { q: 4, r: -3 }, { q: 4, r: -4 },
      { q: 3, r: 0 }, { q: 3, r: -1 }, { q: 3, r: -2 }, { q: 3, r: -3 },
      { q: 2, r: 0 },
    ],
    [
      { q: -4, r: 0 }, { q: -4, r: 1 }, { q: -4, r: 2 }, { q: -4, r: 3 }, { q: -4, r: 4 },
      { q: -3, r: 0 }, { q: -3, r: 1 }, { q: -3, r: 2 }, { q: -3, r: 3 },
      { q: -2, r: 0 },
    ],
    [
      { q: 4, r: -4 }, { q: 3, r: -5 }, { q: 2, r: -5 }, { q: 1, r: -4 }, { q: 0, r: -3 },
      { q: 3, r: -4 }, { q: 2, r: -4 }, { q: 1, r: -3 }, { q: 0, r: -4 },
      { q: 2, r: -3 },
    ],
    [
      { q: -4, r: 4 }, { q: -3, r: 5 }, { q: -2, r: 5 }, { q: -1, r: 4 }, { q: 0, r: 3 },
      { q: -3, r: 4 }, { q: -2, r: 4 }, { q: -1, r: 3 }, { q: 0, r: 4 },
      { q: -2, r: 3 },
    ],
  ];

  constructor() {
    this.board = new Map<string, Cell>();
    this.initializeBoard();
  }

  getBoard(): Map<string, Cell> {
    return this.board;
  }

  getCell(coord: HexCoord): Cell | undefined {
    return this.board.get(HexBoard.getKey(coord));
  }

  static getKey(coord: HexCoord): string {
    return `${coord.q},${coord.r}`;
  }

  private initializeBoard(): void {
    for (let q = -8; q <= 8; q += 1) {
      for (let r = -8; r <= 8; r += 1) {
        if (HexBoard.isValidPosition(q, r)) {
          const coord: HexCoord = { q, r };
          const cell: Cell = {
            coord,
            pieceColor: null,
            piecePlayerId: null,
          };
          this.board.set(HexBoard.getKey(coord), cell);
        }
      }
    }
  }

  static isValidPosition(q: number, r: number): boolean {
    const s = -q - r;
    const inCentral = Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) <= 4;
    const inTipX = q >= 5 && Math.abs(r) <= 4 && Math.abs(s) <= 4;
    const inTipNegX = q <= -5 && Math.abs(r) <= 4 && Math.abs(s) <= 4;
    const inTipR = r >= 5 && Math.abs(q) <= 4 && Math.abs(s) <= 4;
    const inTipNegR = r <= -5 && Math.abs(q) <= 4 && Math.abs(s) <= 4;
    const inTipY = s >= 5 && Math.abs(q) <= 4 && Math.abs(r) <= 4;
    const inTipNegY = s <= -5 && Math.abs(q) <= 4 && Math.abs(r) <= 4;

    return (
      inCentral ||
      inTipX ||
      inTipNegX ||
      inTipR ||
      inTipNegR ||
      inTipY ||
      inTipNegY
    );
  }

  getNeighbors(coord: HexCoord): HexCoord[] {
    return HexBoard.DIRECTIONS.map((direction) => ({
      q: coord.q + direction.q,
      r: coord.r + direction.r,
    })).filter((neighbor) => HexBoard.isValidPosition(neighbor.q, neighbor.r));
  }

  static getTriangleCells(pointIndex: number): HexCoord[] {
    return [...this.TRIANGLE_CELLS[pointIndex]];
  }

  static getTargetZone(pointIndex: number): HexCoord[] {
    const oppositeIndex = (pointIndex % 2 === 0)
      ? pointIndex + 1
      : pointIndex - 1;
    return this.getTriangleCells(oppositeIndex);
  }

  static getInitialPositions(pointIndex: number): HexCoord[] {
    return this.getTriangleCells(pointIndex);
  }
}
