import { Board } from './components/Board/Board';
import { TurnIndicator } from './components/TurnIndicator/TurnIndicator';
import { GameControls } from './components/GameControls/GameControls';
import { VictoryModal } from './components/VictoryModal/VictoryModal';
import { useEngine } from './hooks/useEngine';
import { useBoardSize } from './hooks/useBoardSize';

function App() {
  const { state, selectedCell, validMoves, handleCellClick, handleReset, handleUndo } = useEngine();
  const hexSize = useBoardSize();

  return (
    <main>
      <h1>Damas Chinas</h1>
      <TurnIndicator currentPlayer={state.currentPlayer} />
      <GameControls
        hasHistory={state.moveHistory.length > 0}
        isGameOver={state.isGameOver}
        onUndo={handleUndo}
        onReset={handleReset}
      />
      <div className="boardContainer">
        <Board
          hexSize={hexSize}
          cells={state.board}
          selectedCell={selectedCell}
          validMoves={validMoves}
          onCellClick={handleCellClick}
        />
      </div>
      {state.isGameOver && state.winner && (
        <VictoryModal
          winnerLabel={state.winner.label}
          winnerColor={state.winner.color}
          onReset={handleReset}
        />
      )}
    </main>
  );
}

export default App;
