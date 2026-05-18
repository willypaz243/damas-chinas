import type { MouseEvent } from "react";

interface HexCellProps {
  cx: number;
  cy: number;
  r: number;
  className?: string;
  onClick?: (event: MouseEvent<SVGPolygonElement>) => void;
  [key: string]: unknown;
}

function getPolygonPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 180) * (60 * index - 30);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
}

export default function HexCell({ cx, cy, r, className, onClick, ...rest }: HexCellProps) {
  return (
    <polygon
      points={getPolygonPoints(cx, cy, r)}
      className={className}
      onClick={onClick}
      {...rest}
    />
  );
}
