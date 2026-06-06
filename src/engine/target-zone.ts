import type { HexCoord } from './types';

export interface TargetZoneCalculator {
  calculate(allCells: HexCoord[]): HexCoord[];
}

export class SouthTargetZone implements TargetZoneCalculator {
  calculate(cells: HexCoord[]): HexCoord[] {
    return cells.filter(c => c.r < -4);
  }
}

export class NorthTargetZone implements TargetZoneCalculator {
  calculate(cells: HexCoord[]): HexCoord[] {
    return cells.filter(c => c.r > 4);
  }
}
