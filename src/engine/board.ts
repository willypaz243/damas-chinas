import type { HexCoord } from './types';
import { cellKey } from './utils';
import { BOARD_COORD_MAX, TRIANGLE_CUTOFF } from './constants';

export class HexBoard {
  private cells: Set<string>;

  constructor() {
    this.cells = new Set();
    this.generateBoard();
  }

  private generateBoard(): void {
    for (let q = -BOARD_COORD_MAX; q <= BOARD_COORD_MAX; q++) {
      for (let r = -BOARD_COORD_MAX; r <= BOARD_COORD_MAX; r++) {
        if (this.isValidPosition(q, r)) {
          this.cells.add(cellKey(q, r));
        }
      }
    }
  }

  isValidPosition(q: number, r: number): boolean {
    const s = -q - r;
    if (Math.abs(q) > BOARD_COORD_MAX || Math.abs(r) > BOARD_COORD_MAX || Math.abs(s) > BOARD_COORD_MAX) return false;
    const coords = [Math.abs(q), Math.abs(r), Math.abs(s)];
    return coords.filter(c => c > TRIANGLE_CUTOFF).length <= 1;
  }

  getNeighbors(q: number, r: number): HexCoord[] {
    const directions: HexCoord[] = [
      { q: 1, r: 0 },
      { q: 1, r: -1 },
      { q: 0, r: -1 },
      { q: -1, r: 0 },
      { q: -1, r: 1 },
      { q: 0, r: 1 },
    ];
    return directions
      .map(d => ({ q: q + d.q, r: r + d.r }))
      .filter(c => this.cells.has(cellKey(c.q, c.r)));
  }

  getAllCells(): HexCoord[] {
    return Array.from(this.cells).map(key => {
      const [q, r] = key.split(',').map(Number);
      return { q, r };
    });
  }

  getCellsCount(): number {
    return this.cells.size;
  }

  hasCell(q: number, r: number): boolean {
    return this.cells.has(cellKey(q, r));
  }
}
