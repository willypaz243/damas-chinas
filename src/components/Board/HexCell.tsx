import { hexToPixel } from '../../engine/utils';

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
  const { x, y } = hexToPixel(q, r, size);

  const points = Array.from({ length: 6 }, (_, i) => {
    const angle = ((60 * i - 90) * Math.PI) / 180;
    return `${x + size * Math.cos(angle)},${y + size * Math.sin(angle)}`;
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
