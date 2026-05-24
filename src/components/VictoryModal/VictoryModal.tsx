import { createPortal } from 'react-dom';

interface VictoryModalProps {
  winnerLabel: string;
  winnerColor: string;
  onReset: () => void;
}

export function VictoryModal({ winnerLabel, winnerColor, onReset }: VictoryModalProps) {
  return createPortal(
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#16213e',
        borderRadius: '16px',
        padding: '2rem 3rem',
        textAlign: 'center',
        border: `3px solid ${winnerColor}`,
        boxShadow: `0 0 30px ${winnerColor}40`,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        alignItems: 'center',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: winnerColor,
          border: '3px solid #1a1a2e',
          boxShadow: `0 0 15px ${winnerColor}`,
        }} />
        <div>
          <div style={{ color: '#888', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Ganador
          </div>
          <div style={{ color: '#eee', fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>
            {winnerLabel}
          </div>
        </div>
        <button
          onClick={onReset}
          style={{
            padding: '0.6rem 2rem',
            borderRadius: '8px',
            border: 'none',
            background: winnerColor,
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Nuevo Juego
        </button>
      </div>
    </div>,
    document.body,
  );
}
