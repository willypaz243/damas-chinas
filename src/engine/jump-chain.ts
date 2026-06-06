import type { HexCoord } from './types';

interface CellProvider {
  getPiece(q: number, r: number): number | null;
  hasCell(q: number, r: number): boolean;
}

export class JumpChainFinder {
  private visited: Set<string>;
  readonly provider: CellProvider;

  constructor(provider: CellProvider) {
    this.provider = provider;
    this.visited = new Set();
  }

  find(start: HexCoord, getNeighbors: (q: number, r: number) => HexCoord[]): HexCoord[] {
    this.visited.clear();
    return this._explore(start, getNeighbors);
  }

  private _explore(coord: HexCoord, getNeighbors: (q: number, r: number) => HexCoord[]): HexCoord[] {
    const key = `${coord.q},${coord.r}`;
    if (this.visited.has(key)) return [];
    this.visited.add(key);

    const jumps: HexCoord[] = [];
    for (const n of getNeighbors(coord.q, coord.r)) {
      const piece = this.provider.getPiece(n.q, n.r);
      if (piece === null) continue;
      const beyond: HexCoord = { q: n.q + (n.q - coord.q), r: n.r + (n.r - coord.r) };
      if (this.provider.hasCell(beyond.q, beyond.r) && this.provider.getPiece(beyond.q, beyond.r) === null) {
        jumps.push(beyond);
        jumps.push(...this._explore(beyond, getNeighbors));
      }
    }
    return jumps;
  }
}
