import type { Cell, HexCoord } from "./types";

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
}
