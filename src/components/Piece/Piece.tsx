import styles from "./Piece.module.css";

interface PieceProps {
  color: string;
  cx: number;
  cy: number;
  r: number;
  className?: string;
  isSelected?: boolean;
}

export default function Piece({ color, cx, cy, r, className, isSelected }: PieceProps) {
  return (
    <g className={`${styles.piece} ${className || ""}`} style={{ transform: `translate(${cx}px, ${cy}px)` }}>
      <circle
        className={`${styles.pieceCircle} ${isSelected ? styles.selected : ""}`}
        r={r}
        fill={color}
        stroke="#333"
        strokeWidth="1.5"
      />
      <circle
        className={styles.pieceHighlight}
        r={r * 0.7}
        fill="url(#pieceGradient)"
        opacity="0.3"
      />
    </g>
  );
}
