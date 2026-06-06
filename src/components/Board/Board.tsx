import { HexCell } from './HexCell';
import { Piece } from '../Piece/Piece';
import { HexBoard } from '../../engine/board';
import { hexToPixel } from '../../engine/utils';
import type { HexCoord, Cell } from '../../engine/types';

interface BoardProps {
  hexSize?: number;
  cellFill?: (coord: HexCoord) => string;
  onCellClick?: (coord: HexCoord) => void;
  cells?: Map<string, Cell>;
  selectedCell?: HexCoord | null;
  validMoves?: HexCoord[];
}

const board = new HexBoard();

function isSameCoord(a: HexCoord, b: HexCoord): boolean {
  return a.q === b.q && a.r === b.r;
}

const MOVE_DOT_RADIUS_RATIO = 0.25;
const MOVE_DOT_STROKE_WIDTH = 1.5;

export function Board({ hexSize = 16, cellFill, onCellClick, cells, selectedCell, validMoves }: BoardProps) {
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

  const pieceRadius = size * 0.38;

  const validSet = new Set(validMoves?.map(c => `${c.q},${c.r}`));

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
      {cells && board.getAllCells().map(({ q, r }) => {
        const key = `${q},${r}`;
        const cell = cells.get(key);
        if (!cell || !cell.pieceColor) return null;
        const { x, y } = hexToPixel(q, r, size);
        return (
          <Piece
            key={`piece-${key}`}
            color={cell.pieceColor}
            cx={x}
            cy={y}
            radius={pieceRadius}
            selected={selectedCell !== null && selectedCell !== undefined && isSameCoord({ q, r }, selectedCell)}
          />
        );
      })}
      {validMoves && board.getAllCells().map(({ q, r }) => {
        if (!validSet.has(`${q},${r}`)) return null;
        const { x, y } = hexToPixel(q, r, size);
        const dotRadius = size * MOVE_DOT_RADIUS_RATIO;
        return (
          <g key={`move-${q},${r}`}>
            <circle
              cx={x}
              cy={y}
              r={dotRadius + MOVE_DOT_STROKE_WIDTH}
              fill="transparent"
              stroke="#27ae60"
              strokeWidth={MOVE_DOT_STROKE_WIDTH * 2}
              opacity={0.5}
              pointerEvents="none"
            />
            <circle
              cx={x}
              cy={y}
              r={dotRadius}
              fill="#2ecc71"
              stroke="#fff"
              strokeWidth={MOVE_DOT_STROKE_WIDTH}
              opacity={0.95}
              pointerEvents="none"
            />
          </g>
        );
      })}
    </svg>
  );
}
