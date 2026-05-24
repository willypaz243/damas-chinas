interface PieceProps {
  color: string;
  cx: number;
  cy: number;
  radius: number;
  selected?: boolean;
}

export function Piece({ color, cx, cy, radius, selected }: PieceProps) {
  return (
    <>
      {selected && (
        <circle
          cx={cx}
          cy={cy}
          r={radius + 2.5}
          fill="none"
          stroke="#f1c40f"
          strokeWidth={3}
          pointerEvents="none"
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill={color}
        stroke="#1a1a2e"
        strokeWidth={1.5}
        pointerEvents="none"
      />
    </>
  );
}
