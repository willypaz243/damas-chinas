import { useMemo } from "react";
import { HexBoard } from "../../engine/board";
import type { HexCoord, GameState } from "../../engine/types";
import HexCell from "./HexCell";
import Piece from "../Piece/Piece";
import styles from "../../styles/Board.module.css";

const DEFAULT_SIZE = 800;
const DEFAULT_RADIUS = 22;

function hexToPixel(coord: HexCoord, radius: number, originX: number, originY: number): [number, number] {
  const x = radius * Math.sqrt(3) * (coord.q + coord.r / 2) + originX;
  const y = radius * 1.5 * coord.r + originY;
  return [x, y];
}

interface BoardProps {
  size?: number;
  state?: GameState;
  onCellClick?: (coord: HexCoord) => void;
}

export default function Board({ size = DEFAULT_SIZE, state, onCellClick }: BoardProps) {
  const board = useMemo(() => new HexBoard(), []);
  const cells = useMemo(() => Array.from(board.getBoard().values()), [board]);
  const radius = DEFAULT_RADIUS;
  const origin = size / 2;

  const pieces = useMemo(() => {
    if (!state) return [];
    return Array.from(state.board.values())
      .filter(cell => cell.pieceColor !== null && cell.piecePlayerId !== null);
  }, [state]);

  return (
    <div className={styles.boardWrapper}>
      <svg
        className={styles.boardSvg}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Tablero de Damas Chinas"
      >
        <defs>
          <radialGradient id="pieceGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {cells.map((cell) => {
          const [cx, cy] = hexToPixel(cell.coord, radius, origin, origin);

          return (
            <HexCell
              key={`${cell.coord.q},${cell.coord.r}`}
              cx={cx}
              cy={cy}
              r={radius}
              className={styles.hexCell}
              data-q={cell.coord.q}
              data-r={cell.coord.r}
              onClick={() => onCellClick?.(cell.coord)}
            />
          );
        })}

        {pieces.map((cell) => {
          const [cx, cy] = hexToPixel(cell.coord, radius, origin, origin);
          const isSelected = state?.selectedPiece?.q === cell.coord.q && 
                            state?.selectedPiece?.r === cell.coord.r;
          
          return (
            <Piece
              key={`piece-${cell.coord.q},${cell.coord.r}`}
              color={cell.pieceColor!}
              cx={cx}
              cy={cy}
              r={radius * 0.85}
              isSelected={isSelected}
            />
          );
        })}
      </svg>
    </div>
  );
}
