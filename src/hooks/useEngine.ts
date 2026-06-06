import { useState, useCallback } from 'react';
import { GameEngine } from '../engine/game';
import type { GameConfig, HexCoord, PlayerId, GameEngine as IGameEngine } from '../engine/types';
import { SouthTargetZone, NorthTargetZone } from '../engine/target-zone';

export const GAME_CONFIG: GameConfig = {
  playerCount: 2,
  players: [
    { id: 1 as PlayerId, color: '#e74c3c', label: 'Jugador 1', piecesInTarget: 0, pointIndex: 0, targetZone: new SouthTargetZone() },
    { id: 2 as PlayerId, color: '#3498db', label: 'Jugador 2', piecesInTarget: 0, pointIndex: 1, targetZone: new NorthTargetZone() },
  ],
  firstPlayerId: 1 as PlayerId,
};

export function useEngine() {
  const [engine] = useState<IGameEngine>(() => new GameEngine(GAME_CONFIG));
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
    engine.reset(GAME_CONFIG);
    setState(engine.getState());
    setSelectedCell(null);
    setValidMoves([]);
  }, [engine]);

  const handleUndo = useCallback(() => {
    const ok = engine.undoLastMove();
    if (ok) {
      setState(engine.getState());
      setSelectedCell(null);
      setValidMoves([]);
    }
  }, [engine]);

  return {
    state, selectedCell, validMoves,
    handleCellClick, handleReset, handleUndo,
  };
}
