import { useState, useCallback } from 'react';
import { Board } from './components/Board/Board';
import { TurnIndicator } from './components/TurnIndicator/TurnIndicator';
import { VictoryModal } from './components/VictoryModal/VictoryModal';
import { GameEngine } from './engine/game';
import type { GameConfig, HexCoord, PlayerId } from './engine/types';

const GAME_CONFIG: GameConfig = {
  playerCount: 2,
  players: [
    { id: 1 as PlayerId, color: '#e74c3c', label: 'Jugador 1', piecesInTarget: 0, pointIndex: 0 },
    { id: 2 as PlayerId, color: '#3498db', label: 'Jugador 2', piecesInTarget: 0, pointIndex: 1 },
  ],
  firstPlayerId: 1 as PlayerId,
};

export function useEngine() {
  const [engine, setEngine] = useState(() => new GameEngine(GAME_CONFIG));
  const [state, setState] = useState(() => engine.getState());
  const [selectedCell, setSelectedCell] = useState<HexCoord | null>(null);
  const [validMoves, setValidMoves] = useState<HexCoord[]>([]);

  const handleCellClick = useCallback((coord: HexCoord) => {
    if (selectedCell) {
      const isMoveTarget = validMoves.some(m => m.q === coord.q && m.r === coord.r);
      if (isMoveTarget) {
        const result = engine.executeMove(selectedCell, coord);
        if (result.success) {
          setState(engine.getState());
          setSelectedCell(null);
          setValidMoves([]);
          return;
        }
      }
    }

    if (state.isGameOver) return;

    const result = engine.selectPiece(coord);
    if (result.success) {
      setSelectedCell(coord);
      setValidMoves(result.validMoves ?? []);
    } else {
      setSelectedCell(null);
      setValidMoves([]);
    }
  }, [engine, selectedCell, validMoves, state.isGameOver]);

  const handleReset = useCallback(() => {
    const newEngine = new GameEngine(GAME_CONFIG);
    setEngine(newEngine);
    setState(newEngine.getState());
    setSelectedCell(null);
    setValidMoves([]);
  }, []);

  return { state, selectedCell, validMoves, handleCellClick, handleReset };
}

function App() {
  const { state, selectedCell, validMoves, handleCellClick, handleReset } = useEngine();

  return (
    <main>
      <h1>Damas Chinas</h1>
      <TurnIndicator currentPlayer={state.currentPlayer} />
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
