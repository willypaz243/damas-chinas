import { Board } from './components/Board/Board';
import { TurnIndicator } from './components/TurnIndicator/TurnIndicator';
import { GameControls } from './components/GameControls/GameControls';
import { VictoryModal } from './components/VictoryModal/VictoryModal';
import { useEngine } from './hooks/useEngine';

function App() {
  const { state, selectedCell, validMoves, handleCellClick, handleReset, handleUndo } = useEngine();

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
      <Board
        hexSize={20}
        cells={state.board}
        selectedCell={selectedCell}
        validMoves={validMoves}
        onCellClick={handleCellClick}
      />
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
