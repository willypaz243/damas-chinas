import type { HexCoord } from './types';

export class HexBoard {
  private cells: Set<string>;

  constructor() {
    this.cells = new Set();
    this.generateBoard();
  }

  private cellKey(q: number, r: number): string {
    return `${q},${r}`;
  }

  private generateBoard(): void {
    for (let q = -8; q <= 8; q++) {
      for (let r = -8; r <= 8; r++) {
        if (this.isValidPosition(q, r)) {
          this.cells.add(this.cellKey(q, r));
        }
      }
    }
  }

  isValidPosition(q: number, r: number): boolean {
    const s = -q - r;
    if (Math.abs(q) > 8 || Math.abs(r) > 8 || Math.abs(s) > 8) return false;
    const coords = [Math.abs(q), Math.abs(r), Math.abs(s)];
    return coords.filter(c => c > 4).length <= 1;
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
      .filter(c => this.cells.has(this.cellKey(c.q, c.r)));
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
    return this.cells.has(this.cellKey(q, r));
  }
}
