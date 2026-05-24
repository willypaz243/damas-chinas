import type { PlayerConfig } from '../../engine/types';

interface TurnIndicatorProps {
  currentPlayer: PlayerConfig;
}

export function TurnIndicator({ currentPlayer }: TurnIndicatorProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      background: '#16213e',
      border: `2px solid ${currentPlayer.color}`,
      color: '#eee',
      fontSize: '1rem',
      fontWeight: 500,
    }}>
      <span style={{
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        background: currentPlayer.color,
        border: '2px solid #1a1a2e',
        flexShrink: 0,
      }} />
      <span>Turno de: <strong>{currentPlayer.label}</strong></span>
    </div>
  );
}
