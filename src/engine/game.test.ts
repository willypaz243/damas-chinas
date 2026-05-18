import { describe, expect, it } from "vitest";
import { GameEngine } from "./game";
import type { GameConfig } from "./types";

describe("GameEngine", () => {
  it("creates game engine and initializes state", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    const state = engine.reset(config);

    expect(state.players).toHaveLength(2);
    expect(state.currentPlayer.id).toBe(1);
    expect(state.playerCount).toBe(2);
    expect(state.moveHistory).toHaveLength(0);
  });

  it("initializes pieces for players", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);
    const state = engine.getState();

    let player1Pieces = 0;
    let player2Pieces = 0;

    state.board.forEach((cell) => {
      if (cell.piecePlayerId === 1) player1Pieces++;
      if (cell.piecePlayerId === 2) player2Pieces++;
    });

    expect(player1Pieces).toBe(10);
    expect(player2Pieces).toBe(10);
  });

  it("validates correct move for step", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    const from = { q: 0, r: -4 };
    const to = { q: 1, r: -4 };
    
    const result = engine.canMove(from, to);
    
    expect(result.valid).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("rejects move to occupied position", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    const from = { q: 0, r: -4 };
    const to = { q: 0, r: -4 };

    const result = engine.canMove(from, to);

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("occupied");
  });

  it("rejects move of opponent piece", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    const from = { q: 0, r: 4 };
    const to = { q: 0, r: 3 };

    const result = engine.canMove(from, to);

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("wrong_player");
  });

  it("executes valid move and updates state", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    const from = { q: 0, r: -4 };
    const to = { q: 1, r: -4 };
    
    const result = engine.executeMove(from, to);
    
    expect(result.success).toBe(true);
    
    const newState = engine.getState();
    expect(newState.selectedPiece).toBeNull();
    expect(newState.moveHistory).toHaveLength(1);
    expect(newState.currentPlayer.id).toBe(2);
  });

  it("switches turn correctly", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    const firstPlayerId = engine.getNextPlayerId();
    expect(firstPlayerId).toBe(2);

    engine.switchTurn();
    const secondPlayerId = engine.getNextPlayerId();
    expect(secondPlayerId).toBe(1);
  });

  it("selects piece and returns valid moves", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    const coord = { q: 0, r: -4 };
    const result = engine.selectPiece(coord);

    expect(result.success).toBe(true);
    expect(result.validMoves).toBeInstanceOf(Array);

    const state = engine.getState();
    expect(state.selectedPiece).toEqual(coord);
  });

  it("updates player progress after move", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    const initialPlayer1Progress = engine.getState().players[0].piecesInTarget;
    expect(initialPlayer1Progress).toBe(0);

    engine.executeMove({ q: 0, r: -4 }, { q: 0, r: -3 });

    const updatedPlayer1Progress = engine.getState().players[0].piecesInTarget;
    expect(updatedPlayer1Progress).toBe(1);
  });

  it("checks victory condition", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    const winnerBefore = engine.checkVictory();
    expect(winnerBefore).toBeNull();
  });

  it("returns correct player IDs for turn management", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 2,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
      ],
      firstPlayerId: 1,
    };

    engine.reset(config);

    expect(engine.getNextPlayerId()).toBe(2);
    expect(engine.getPreviousPlayerId()).toBe(2);

    engine.switchTurn();

    expect(engine.getNextPlayerId()).toBe(1);
    expect(engine.getPreviousPlayerId()).toBe(1);
  });

  it("handles multiple players correctly", () => {
    const engine = new GameEngine();
    const config: GameConfig = {
      playerCount: 4,
      players: [
        { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0 },
        { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0 },
        { id: 3, color: "#2ECC71", label: "Jugador 3", piecesInTarget: 0 },
        { id: 4, color: "#F39C12", label: "Jugador 4", piecesInTarget: 0 },
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
});
