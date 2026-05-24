interface HexCellProps {
  q: number;
  r: number;
  size: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  onClick?: () => void;
}

export function HexCell({ q, r, size, fill = '#f0f0f0', stroke = '#bbb', strokeWidth = 0.5, onClick }: HexCellProps) {
  const cx = size * Math.sqrt(3) * (q + r / 2);
  const cy = size * 1.5 * r;

  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = ((60 * i - 90) * Math.PI) / 180;
    return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
  }).join(' ');

  return (
    <polygon
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : undefined }}
    />
  );
}
