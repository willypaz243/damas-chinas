import type { PlayerConfig } from '../../engine/types';

interface TurnIndicatorProps {
  currentPlayer: PlayerConfig;
}

export function TurnIndicator({ currentPlayer }: TurnIndicatorProps) {
  return (
    <div className="turnIndicator" style={{ border: `2px solid ${currentPlayer.color}` }}>
      <span className="dot" style={{ background: currentPlayer.color }} />
      <span>Turno de: <strong>{currentPlayer.label}</strong></span>
    </div>
  );
}
