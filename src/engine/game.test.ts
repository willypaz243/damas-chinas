import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from './game';
import type { GameConfig, PlayerId, HexCoord } from './types';

const TEST_CONFIG: GameConfig = {
  playerCount: 2,
  players: [
    { id: 1 as PlayerId, color: '#e74c3c', label: 'Jugador 1', piecesInTarget: 0, pointIndex: 0 },
    { id: 2 as PlayerId, color: '#3498db', label: 'Jugador 2', piecesInTarget: 0, pointIndex: 1 },
  ],
  firstPlayerId: 1 as PlayerId,
};

function setPiece(engine: GameEngine, coord: HexCoord, playerId: PlayerId, color: string): void {
  const key = `${coord.q},${coord.r}`;
  const state = (engine as any).state;
  state.board.set(key, { coord, pieceColor: color, piecePlayerId: playerId });
}

function clearCell(engine: GameEngine, coord: HexCoord): void {
  const key = `${coord.q},${coord.r}`;
  const state = (engine as any).state;
  state.board.set(key, { coord, pieceColor: null, piecePlayerId: null });
}

describe('GameEngine', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine(TEST_CONFIG);
  });

  describe('selectPiece', () => {
    it('debe seleccionar ficha del jugador actual', () => {
      const result = engine.selectPiece({ q: -4, r: 5 });
      expect(result.success).toBe(true);
      expect(result.validMoves).toBeDefined();
    });

    it('debe rechazar selección en celda vacía', () => {
      const result = engine.selectPiece({ q: 0, r: 0 });
      expect(result.success).toBe(false);
    });

    it('debe rechazar selección de ficha del oponente', () => {
      const result = engine.selectPiece({ q: 4, r: -5 });
      expect(result.success).toBe(false);
    });

    it('debe rechazar selección en coordenada fuera del tablero', () => {
      const result = engine.selectPiece({ q: 99, r: 99 });
      expect(result.success).toBe(false);
    });

    it('debe mantener la selección previa al llamar selectPiece de nuevo', () => {
      engine.selectPiece({ q: -4, r: 5 });
      const secondResult = engine.selectPiece({ q: -1, r: 5 });
      expect(secondResult.success).toBe(true);
    });
  });

  describe('getValidMoves', () => {
    it('ficha en (-1, 5) debe tener movimientos paso hacia el centro', () => {
      const result = engine.selectPiece({ q: -1, r: 5 });
      expect(result.success).toBe(true);

      const validKeys = result.validMoves!.map(c => `${c.q},${c.r}`);
      expect(validKeys).toContain('0,4');
      expect(validKeys).toContain('-1,4');
    });

    it('ficha en la punta sur (-4, 8) no debe tener movimientos (rodeada de fichas)', () => {
      const result = engine.selectPiece({ q: -4, r: 8 });
      expect(result.validMoves).toHaveLength(0);
    });

    it('no debe incluir movimientos paso a celdas ocupadas', () => {
      const result = engine.selectPiece({ q: -4, r: 5 });
      for (const move of result.validMoves!) {
        const cell = engine.getState().board.get(`${move.q},${move.r}`);
        expect(cell?.pieceColor).toBeNull();
      }
    });

    it('ficha en (-1, 5) no debe tener saltos inicialmente', () => {
      const result = engine.selectPiece({ q: -1, r: 5 });
      const stepMoves = result.validMoves!.filter(m =>
        Math.abs(m.q - (-1)) <= 1 && Math.abs(m.r - 5) <= 1
      );
      expect(stepMoves.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('chain jumps', () => {
    it('ficha debe poder saltar en cadena sobre dos piezas seguidas', () => {
      const eng = new GameEngine(TEST_CONFIG);

      clearCell(eng, { q: 0, r: 5 });
      setPiece(eng, { q: 0, r: 2 }, 1 as PlayerId, '#e74c3c');
      setPiece(eng, { q: 1, r: 1 }, 2 as PlayerId, '#3498db');
      setPiece(eng, { q: 3, r: -1 }, 2 as PlayerId, '#3498db');

      const result = eng.selectPiece({ q: 0, r: 2 });
      expect(result.success).toBe(true);
      const validKeys = result.validMoves!.map(c => `${c.q},${c.r}`);
      expect(validKeys).toContain('2,0');
      expect(validKeys).toContain('4,-2');
    });

    it('debe rechazar salto cuando la casilla destino intermedia está ocupada', () => {
      const eng = new GameEngine(TEST_CONFIG);

      clearCell(eng, { q: 0, r: 5 });
      setPiece(eng, { q: 0, r: 2 }, 1 as PlayerId, '#e74c3c');
      setPiece(eng, { q: 1, r: 1 }, 2 as PlayerId, '#3498db');
      setPiece(eng, { q: 2, r: 0 }, 2 as PlayerId, '#3498db');

      const result = eng.selectPiece({ q: 0, r: 2 });
      const validKeys = result.validMoves!.map(c => `${c.q},${c.r}`);
      expect(validKeys).not.toContain('2,0');
      expect(validKeys).toContain('0,1');
      expect(validKeys).toContain('1,2');
    });
  });

  describe('executeMove', () => {
    it('debe ejecutar un paso válido y mover la ficha', () => {
      const result = engine.executeMove({ q: -1, r: 5 }, { q: 0, r: 4 });
      expect(result.success).toBe(true);

      const fromCell = engine.getState().board.get('-1,5');
      const toCell = engine.getState().board.get('0,4');
      expect(fromCell?.pieceColor).toBeNull();
      expect(fromCell?.piecePlayerId).toBeNull();
      expect(toCell?.pieceColor).toBe('#e74c3c');
      expect(toCell?.piecePlayerId).toBe(1);
    });

    it('debe cambiar el turno tras un movimiento válido', () => {
      engine.executeMove({ q: -1, r: 5 }, { q: 0, r: 4 });
      expect(engine.getState().currentPlayer.id).toBe(2);
    });

    it('debe registrar el movimiento en el historial', () => {
      engine.executeMove({ q: -1, r: 5 }, { q: 0, r: 4 });
      expect(engine.getState().moveHistory).toHaveLength(1);
      expect(engine.getState().moveHistory[0].from).toEqual({ q: -1, r: 5 });
      expect(engine.getState().moveHistory[0].to).toEqual({ q: 0, r: 4 });
    });

    it('debe rechazar movimiento a celda ocupada', () => {
      engine.executeMove({ q: -1, r: 5 }, { q: -4, r: 8 });
      expect(engine.executeMove({ q: 0, r: 4 }, { q: -4, r: 8 }).success).toBe(false);
    });

    it('debe rechazar movimiento de celda sin ficha', () => {
      const result = engine.executeMove({ q: 0, r: 0 }, { q: 1, r: 1 });
      expect(result.success).toBe(false);
    });

    it('debe rechazar mover ficha del oponente', () => {
      const result = engine.executeMove({ q: 4, r: -5 }, { q: 3, r: -5 });
      expect(result.success).toBe(false);
    });

    it('debe rechazar movimiento inválido (no adyacente ni salto)', () => {
      const result = engine.executeMove({ q: -4, r: 5 }, { q: 3, r: -4 });
      expect(result.success).toBe(false);
    });
  });

  describe('checkVictory', () => {
  it('debe detectar victoria cuando un jugador tiene todas sus fichas en zona objetivo', () => {
    const eng = new GameEngine(TEST_CONFIG);
    const board = eng.getState().board;
    const northCells = Array.from(board.values()).filter(c => c.coord.r < -4);
    expect(northCells).toHaveLength(10);

    for (const cell of board.values()) {
      if (cell.coord.r > 4) {
        clearCell(eng, cell.coord);
      }
    }
    for (let i = 0; i < northCells.length; i++) {
      setPiece(eng, northCells[i].coord, 1 as PlayerId, '#e74c3c');
    }

    const winner = eng.checkVictory();
    expect(winner).not.toBeNull();
    expect(winner!.id).toBe(1);
  });

  it('debe retornar null cuando ningún jugador ha ganado', () => {
    const result = engine.checkVictory();
    expect(result).toBeNull();
  });

  it('debe detectar victoria del jugador 2', () => {
    const eng = new GameEngine(TEST_CONFIG);
    const board = eng.getState().board;
    const southCells = Array.from(board.values()).filter(c => c.coord.r > 4);
    expect(southCells).toHaveLength(10);

    for (const cell of board.values()) {
      if (cell.coord.r < -4) {
        clearCell(eng, cell.coord);
      }
    }
    for (let i = 0; i < southCells.length; i++) {
      setPiece(eng, southCells[i].coord, 2 as PlayerId, '#3498db');
    }

    const winner = eng.checkVictory();
    expect(winner).not.toBeNull();
    expect(winner!.id).toBe(2);
  });

  it('debe retornar null con victoria parcial (menos de 10 fichas)', () => {
    const eng = new GameEngine(TEST_CONFIG);
    const c = Array.from(eng.getState().board.values()).find(c => c.coord.r < -4)!;
    clearCell(eng, { q: -1, r: 5 });
    setPiece(eng, c.coord, 1 as PlayerId, '#e74c3c');

    expect(eng.checkVictory()).toBeNull();
  });
});

describe('switchTurn', () => {
    it('debe alternar entre jugador 1 y 2', () => {
      engine.switchTurn();
      expect(engine.getState().currentPlayer.id).toBe(2);
      engine.switchTurn();
      expect(engine.getState().currentPlayer.id).toBe(1);
    });

    it('debe limpiar la selección al cambiar de turno', () => {
      engine.selectPiece({ q: -1, r: 5 });
      engine.switchTurn();
      expect(engine.getState().selectedPiece).toBeNull();
      expect(engine.getState().validMoves).toHaveLength(0);
    });
  });

  describe('reset', () => {
    it('debe reiniciar el tablero con fichas en posición inicial', () => {
      const state = engine.getState();
      let player1Count = 0;
      let player2Count = 0;

      for (const [, cell] of state.board) {
        if (cell.piecePlayerId === 1) player1Count++;
        if (cell.piecePlayerId === 2) player2Count++;
      }

      expect(player1Count).toBe(10);
      expect(player2Count).toBe(10);
    });

    it('debe empezar con el jugador 1', () => {
      const state = engine.getState();
      expect(state.currentPlayer.id).toBe(1);
    });
  });

  describe('game over', () => {
    it('debe marcar isGameOver cuando un jugador gana', () => {
      const eng = new GameEngine(TEST_CONFIG);
      const board = eng.getState().board;

      for (const cell of board.values()) {
        if (cell.coord.r < -4 || cell.coord.r > 4) {
          clearCell(eng, cell.coord);
        }
      }
      const northCells = Array.from(board.values()).filter(c => c.coord.r < -4);
      const occupiedNorth = northCells.filter(c => !(c.coord.q === 1 && c.coord.r === -5));
      for (const c of occupiedNorth) {
        setPiece(eng, c.coord, 1 as PlayerId, '#e74c3c');
      }
      setPiece(eng, { q: 0, r: -4 }, 1 as PlayerId, '#e74c3c');

      const moveResult = eng.executeMove({ q: 0, r: -4 }, { q: 1, r: -5 });
      expect(moveResult.success).toBe(true);

      const stateAfter = eng.getState();
      expect(stateAfter.isGameOver).toBe(true);
      expect(stateAfter.winner).not.toBeNull();
      expect(stateAfter.winner!.id).toBe(1);
    });

    it('no debe cambiar de turno cuando el juego termina', () => {
      const eng = new GameEngine(TEST_CONFIG);
      const board = eng.getState().board;

      for (const cell of board.values()) {
        if (cell.coord.r < -4 || cell.coord.r > 4) {
          clearCell(eng, cell.coord);
        }
      }
      const northCells = Array.from(board.values()).filter(c => c.coord.r < -4);
      const occupiedNorth = northCells.filter(c => !(c.coord.q === 1 && c.coord.r === -5));
      for (const c of occupiedNorth) {
        setPiece(eng, c.coord, 1 as PlayerId, '#e74c3c');
      }
      setPiece(eng, { q: 0, r: -4 }, 1 as PlayerId, '#e74c3c');

      const currentPlayer = eng.getState().currentPlayer;
      eng.executeMove({ q: 0, r: -4 }, { q: 1, r: -5 });

      const stateAfter = eng.getState();
      expect(stateAfter.currentPlayer.id).toBe(currentPlayer.id);
      expect(stateAfter.isGameOver).toBe(true);
    });
  });
});
