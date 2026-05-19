import { useState, useMemo } from "react";
import Board from "./components/Board/Board";
import { GameEngine } from "./engine/game";
import type { GameConfig, HexCoord } from "./engine/types";

const defaultConfig: GameConfig = {
  playerCount: 2,
  players: [
    { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0, pointIndex: 0 },
    { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0, pointIndex: 1 },
  ],
  firstPlayerId: 1,
};

function App() {
  const engine = useMemo(() => new GameEngine(), []);
  const [gameState, setGameState] = useState(() => {
    engine.reset(defaultConfig);
    return engine.getState();
  });

  const handleCellClick = (coord: HexCoord) => {
    console.log("Cell clicked:", coord);
    const result = engine.selectPiece(coord);
    if (result.success) {
      setGameState(engine.getState());
    }
  };

  return (
    <main>
      <h1>Damas Chinas</h1>
      <Board 
        size={800} 
        state={gameState} 
        onCellClick={handleCellClick} 
      />
    </main>
  );
}

export default App;
