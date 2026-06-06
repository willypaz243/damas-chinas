import { createPortal } from 'react-dom';

interface VictoryModalProps {
  winnerLabel: string;
  winnerColor: string;
  onReset: () => void;
}

export function VictoryModal({ winnerLabel, winnerColor, onReset }: VictoryModalProps) {
  return createPortal(
    <div className="victoryModal">
      <div className="modalContent" style={{ border: `3px solid ${winnerColor}`, boxShadow: `0 0 30px ${winnerColor}40` }}>
        <div className="winnerDot" style={{ background: winnerColor, boxShadow: `0 0 15px ${winnerColor}` }} />
        <div>
          <div className="winnerLabel">Ganador</div>
          <div className="winnerName">{winnerLabel}</div>
        </div>
        <button
          onClick={onReset}
          className="resetBtn"
          style={{ background: winnerColor }}
        >
          Nuevo Juego
        </button>
      </div>
    </div>,
    document.body,
  );
}
