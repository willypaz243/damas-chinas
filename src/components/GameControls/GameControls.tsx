interface GameControlsProps {
  hasHistory: boolean;
  isGameOver: boolean;
  onUndo: () => void;
  onReset: () => void;
}

export function GameControls({ hasHistory, isGameOver, onUndo, onReset }: GameControlsProps) {
  return (
    <div className="gameControls">
      <button onClick={onReset}>
        Nuevo Juego
      </button>
      <button
        onClick={onUndo}
        disabled={!hasHistory || isGameOver}
      >
        Deshacer
      </button>
    </div>
  );
}
