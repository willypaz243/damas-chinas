import { HexCell } from './HexCell';
import { HexBoard } from '../../engine/board';
import type { HexCoord } from '../../engine/types';

interface BoardProps {
  hexSize?: number;
  cellFill?: (coord: HexCoord) => string;
  onCellClick?: (coord: HexCoord) => void;
}

const board = new HexBoard();

export function Board({ hexSize = 16, cellFill, onCellClick }: BoardProps) {
  const size = hexSize;

  const maxX = size * Math.sqrt(3) * (8 + (-4) / 2);
  const minY = size * 1.5 * (-8);
  const maxY = size * 1.5 * 8;

  const padding = size;
  const viewBox = [
    -(maxX + padding),
    minY - padding,
    (maxX + padding) * 2,
    (maxY - minY) + padding * 2,
  ].join(' ');

  return (
    <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      {board.getAllCells().map(({ q, r }) => {
        const coord: HexCoord = { q, r };
        return (
          <HexCell
            key={`${q},${r}`}
            q={q}
            r={r}
            size={size}
            fill={cellFill ? cellFill(coord) : undefined}
            onClick={onCellClick ? () => onCellClick(coord) : undefined}
          />
        );
      })}
    </svg>
  );
}
