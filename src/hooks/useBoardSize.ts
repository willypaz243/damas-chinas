import { useState, useRef, useEffect } from 'react';

// Board content dimensions in terms of hexSize:
//   viewBox width  = hexSize * (12*sqrt(3) + 2) ≈ hexSize * 22.785
//   viewBox height = hexSize * 26
const VIEWBOX_W_FACTOR = 12 * Math.sqrt(3) + 2;
const VIEWBOX_H_FACTOR = 26;

// Margins in px for UI chrome (title, turn indicator, controls, victory modal)
const MARGIN_X = 32;   // 1rem left/right
const MARGIN_Y_DESKTOP = 160; // ~4rem top/bottom on desktop
const MARGIN_Y_MOBILE = 100;  // less chrome space on mobile

function computeSize(w: number, h: number): number {
  const isMobile = w < 768;
  const marginY = isMobile ? MARGIN_Y_MOBILE : MARGIN_Y_DESKTOP;
  const availableW = w - MARGIN_X * 2;
  const availableH = h - marginY;
  const hexSize = Math.min(availableW / VIEWBOX_W_FACTOR, availableH / VIEWBOX_H_FACTOR);
  return Math.max(8, Math.min(hexSize, 60)); // clamp: 8px min, 60px max
}

export function useBoardSize(): number {
  const [size, setSize] = useState(() => computeSize(window.innerWidth, window.innerHeight));
  const ref = useRef(size);

  useEffect(() => {
    let rafId: number;
    const onResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const newSize = computeSize(window.innerWidth, window.innerHeight);
        if (newSize !== ref.current) {
          ref.current = newSize;
          setSize(newSize);
        }
      });
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return size;
}
