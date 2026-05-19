import { describe, expect, it } from "vitest";
import { GameEngine } from "./game";
import { HexBoard } from "./board";
import type { GameConfig } from "./types";

function create2PlayerConfig(): GameConfig {
  return {
    playerCount: 2,
    players: [
      { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0, pointIndex: 0 },
      { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0, pointIndex: 1 },
    ],
    firstPlayerId: 1,
  };
}

function getPieceCount(engine: GameEngine, playerId: number): number {
  let count = 0;
  engine.getState().board.forEach((cell) => {
    if (cell.piecePlayerId === playerId) count++;
  });
  return count;
}

describe("GameEngine", () => {
  it("creates game engine and initializes state", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    const state = engine.reset(config);

    expect(state.players).toHaveLength(2);
    expect(state.currentPlayer.id).toBe(1);
    expect(state.playerCount).toBe(2);
    expect(state.moveHistory).toHaveLength(0);
  });

  it("initializes 10 pieces for each player in correct positions", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    expect(getPieceCount(engine, 1)).toBe(10);
    expect(getPieceCount(engine, 2)).toBe(10);
  });

  it("places pieces in the correct triangle cells for each player", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    const southCells = HexBoard.getTriangleCells(0);
    const northCells = HexBoard.getTriangleCells(1);

    for (const coord of southCells) {
      const cell = engine.getState().board.get(HexBoard.getKey(coord));
      expect(cell?.piecePlayerId).toBe(1);
    }

    for (const coord of northCells) {
      const cell = engine.getState().board.get(HexBoard.getKey(coord));
      expect(cell?.piecePlayerId).toBe(2);
    }
  });

  it("validates step move to empty adjacent cell", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    // Jugador 1 está en triángulo Sur (point 0): mover a celda vacía adyacente
    // (-4, 5) es ocupada, (-3, 5) también, pero (-4, 4) está vacía
    const from = { q: -4, r: 5 };
    const to = { q: -4, r: 4 };

    const result = engine.canMove(from, to);
    expect(result.valid).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("rejects move to occupied position", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    // Misma celda - ocupada por pieza del jugador 1
    const from = { q: -4, r: 5 };
    const to = { q: -4, r: 5 };

    const result = engine.canMove(from, to);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("occupied");
  });

  it("rejects move of opponent piece", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    // Intentar mover pieza del jugador 2 (triángulo Norte)
    const from = { q: 1, r: -5 };
    const to = { q: 1, r: -4 };

    const result = engine.canMove(from, to);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("wrong_player");
  });

  it("executes valid move and updates state", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    const from = { q: -4, r: 5 };
    const to = { q: -4, r: 4 };

    const result = engine.executeMove(from, to);
    expect(result.success).toBe(true);

    const newState = engine.getState();
    expect(newState.selectedPiece).toBeNull();
    expect(newState.moveHistory).toHaveLength(1);
    expect(newState.currentPlayer.id).toBe(2);

    const fromCell = newState.board.get(HexBoard.getKey(from));
    const toCell = newState.board.get(HexBoard.getKey(to));
    expect(fromCell?.piecePlayerId).toBeNull();
    expect(toCell?.piecePlayerId).toBe(1);
  });

  it("switches turn correctly", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    expect(engine.getNextPlayerId()).toBe(2);

    engine.switchTurn();
    expect(engine.getNextPlayerId()).toBe(1);
  });

  it("selects piece and returns valid moves", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    const coord = { q: -4, r: 5 };
    const result = engine.selectPiece(coord);

    expect(result.success).toBe(true);
    expect(result.validMoves).toBeInstanceOf(Array);

    const state = engine.getState();
    expect(state.selectedPiece).toEqual(coord);
  });

  it("updates player progress as pieces in target zone", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    expect(engine.getState().players[0].piecesInTarget).toBe(0);
    expect(engine.getState().players[1].piecesInTarget).toBe(0);
  });

  it("checks victory condition returns null when no winner", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    expect(engine.checkVictory()).toBeNull();
  });

  it("returns correct player IDs for turn management", () => {
    const engine = new GameEngine();
    const config = create2PlayerConfig();
    engine.reset(config);

    expect(engine.getNextPlayerId()).toBe(2);
    expect(engine.getPreviousPlayerId()).toBe(2);

    engine.switchTurn();
    expect(engine.getNextPlayerId()).toBe(1);
    expect(engine.getPreviousPlayerId()).toBe(1);
  });

  it("handles multiple players (4) with correct turn rotation", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 4,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0, pointIndex: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0, pointIndex: 1 },
        { id: 3, color: "#2ECC71", label: "Jugador 3", piecesInTarget: 0, pointIndex: 2 },
        { id: 4, color: "#F39C12", label: "Jugador 4", piecesInTarget: 0, pointIndex: 3 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);
    expect(engine.getState().players).toHaveLength(4);
    expect(engine.getNextPlayerId()).toBe(2);

    engine.switchTurn();
    expect(engine.getNextPlayerId()).toBe(3);

    engine.switchTurn();
    expect(engine.getNextPlayerId()).toBe(4);

    engine.switchTurn();
    expect(engine.getNextPlayerId()).toBe(1);
  });

  // ── HU-A2 tests: Multi-player initial positions ──────────

  it("initializes correct positions for 2 players (points 0 and 1)", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0, pointIndex: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0, pointIndex: 1 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    expect(getPieceCount(engine, 1)).toBe(10);
    expect(getPieceCount(engine, 2)).toBe(10);

    const p1cells = HexBoard.getTriangleCells(0);
    for (const c of p1cells) {
      expect(engine.getState().board.get(HexBoard.getKey(c))?.piecePlayerId).toBe(1);
    }

    const p2cells = HexBoard.getTriangleCells(1);
    for (const c of p2cells) {
      expect(engine.getState().board.get(HexBoard.getKey(c))?.piecePlayerId).toBe(2);
    }
  });

  it("initializes 4 players with pieces in assigned triangles", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 4,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0, pointIndex: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0, pointIndex: 1 },
        { id: 3, color: "#2ECC71", label: "Jugador 3", piecesInTarget: 0, pointIndex: 2 },
        { id: 4, color: "#F39C12", label: "Jugador 4", piecesInTarget: 0, pointIndex: 3 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    for (const playerId of [1, 2, 3, 4]) {
      expect(getPieceCount(engine, playerId)).toBeGreaterThan(0);
    }
  });

  it("initializes 6 players with pieces in assigned triangles", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 6,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0, pointIndex: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0, pointIndex: 1 },
        { id: 3, color: "#2ECC71", label: "Jugador 3", piecesInTarget: 0, pointIndex: 2 },
        { id: 4, color: "#F39C12", label: "Jugador 4", piecesInTarget: 0, pointIndex: 3 },
        { id: 5, color: "#9B59B6", label: "Jugador 5", piecesInTarget: 0, pointIndex: 4 },
        { id: 6, color: "#1ABC9C", label: "Jugador 6", piecesInTarget: 0, pointIndex: 5 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    for (const playerId of [1, 2, 3, 4, 5, 6]) {
      expect(getPieceCount(engine, playerId)).toBeGreaterThan(0);
    }
  });

  it("places target zone as opposite triangle", () => {
    expect(HexBoard.getTargetZone(0)).toEqual(HexBoard.getTriangleCells(1));
    expect(HexBoard.getTargetZone(1)).toEqual(HexBoard.getTriangleCells(0));
    expect(HexBoard.getTargetZone(2)).toEqual(HexBoard.getTriangleCells(3));
    expect(HexBoard.getTargetZone(3)).toEqual(HexBoard.getTriangleCells(2));
    expect(HexBoard.getTargetZone(4)).toEqual(HexBoard.getTriangleCells(5));
    expect(HexBoard.getTargetZone(5)).toEqual(HexBoard.getTriangleCells(4));
  });
});
