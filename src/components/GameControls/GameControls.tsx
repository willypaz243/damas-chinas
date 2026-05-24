interface GameControlsProps {
  hasHistory: boolean;
  isGameOver: boolean;
  onUndo: () => void;
  onReset: () => void;
}

export function GameControls({ hasHistory, isGameOver, onUndo, onReset }: GameControlsProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '0.5rem',
    }}>
      <button
        onClick={onReset}
        style={{
          padding: '0.5rem 1.2rem',
          borderRadius: '8px',
          border: '2px solid #555',
          background: 'transparent',
          color: '#eee',
          fontSize: '0.9rem',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#e74c3c'; e.currentTarget.style.color = '#e74c3c'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#555'; e.currentTarget.style.color = '#eee'; }}
      >
        Nuevo Juego
      </button>
      <button
        onClick={onUndo}
        disabled={!hasHistory || isGameOver}
        style={{
          padding: '0.5rem 1.2rem',
          borderRadius: '8px',
          border: `2px solid ${!hasHistory || isGameOver ? '#333' : '#555'}`,
          background: 'transparent',
          color: !hasHistory || isGameOver ? '#555' : '#eee',
          fontSize: '0.9rem',
          fontWeight: 500,
          cursor: !hasHistory || isGameOver ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s',
          opacity: !hasHistory || isGameOver ? 0.5 : 1,
        }}
        onMouseEnter={e => {
          if (hasHistory && !isGameOver) {
            e.currentTarget.style.borderColor = '#3498db';
            e.currentTarget.style.color = '#3498db';
          }
        }}
        onMouseLeave={e => {
          if (hasHistory && !isGameOver) {
            e.currentTarget.style.borderColor = '#555';
            e.currentTarget.style.color = '#eee';
          }
        }}
      >
        Deshacer
      </button>
    </div>
  );
}
