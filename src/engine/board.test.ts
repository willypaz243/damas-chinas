import { describe, it, expect } from 'vitest';
import type { HexCoord } from './types';
import { HexBoard } from './board';
import { TOTAL_BOARD_SIZE } from './constants';

describe('HexBoard', () => {
  it('debe tener exactamente TOTAL_BOARD_SIZE casillas', () => {
    const board = new HexBoard();
    expect(board.getCellsCount()).toBe(TOTAL_BOARD_SIZE);
  });

  it('debe validar el centro (0,0)', () => {
    const board = new HexBoard();
    expect(board.isValidPosition(0, 0)).toBe(true);
  });

  it('debe validar la punta sur (-4, 8)', () => {
    const board = new HexBoard();
    expect(board.isValidPosition(-4, 8)).toBe(true);
  });

  it('debe validar la punta norte (4, -8)', () => {
    const board = new HexBoard();
    expect(board.isValidPosition(4, -8)).toBe(true);
  });

  it('debe rechazar posiciones en espacios vacíos entre puntas', () => {
    const board = new HexBoard();
    expect(board.isValidPosition(5, 5)).toBe(false);
    expect(board.isValidPosition(-5, -5)).toBe(false);
    expect(board.isValidPosition(5, 2)).toBe(false);
  });

  it('debe rechazar posiciones fuera del límite máximo de 8', () => {
    const board = new HexBoard();
    expect(board.isValidPosition(0, 9)).toBe(false);
    expect(board.isValidPosition(9, 0)).toBe(false);
    expect(board.isValidPosition(-9, 1)).toBe(false);
  });

  it('debe devolver 6 vecinos para el centro', () => {
    const board = new HexBoard();
    const neighbors = board.getNeighbors(0, 0);
    expect(neighbors).toHaveLength(6);
  });

  it('debe devolver 2 vecinos para la punta sur', () => {
    const board = new HexBoard();
    const neighbors = board.getNeighbors(-4, 8);
    expect(neighbors).toHaveLength(2);
  });

  it('debe devolver 5 vecinos en borde del hexágono central (4, 0)', () => {
    const board = new HexBoard();
    const neighbors = board.getNeighbors(4, 0);
    expect(neighbors).toHaveLength(5);
  });

  it('debe devolver 5 vecinos para el punto (-4, 0)', () => {
    const board = new HexBoard();
    const neighbors = board.getNeighbors(-4, 0);
    expect(neighbors).toHaveLength(5);
  });

  it('debe devolver todas las casillas como HexCoord', () => {
    const board = new HexBoard();
    const allCells = board.getAllCells();
    expect(allCells).toHaveLength(TOTAL_BOARD_SIZE);
    expect(allCells[0]).toHaveProperty('q');
    expect(allCells[0]).toHaveProperty('r');
  });

  it('cada vecino debe ser una posición válida', () => {
    const board = new HexBoard();
    const allCells = board.getAllCells();
    for (const cell of allCells) {
      const neighbors = board.getNeighbors(cell.q, cell.r);
      for (const n of neighbors) {
        expect(board.isValidPosition(n.q, n.r)).toBe(true);
      }
    }
  });

  it('debe tener 10 casillas en la punta sur (r > 4)', () => {
    const board = new HexBoard();
    const south = board.getAllCells().filter((c: HexCoord) => c.r > 4);
    expect(south).toHaveLength(10);
  });

  it('debe tener 10 casillas en la punta norte (r < -4)', () => {
    const board = new HexBoard();
    const north = board.getAllCells().filter((c: HexCoord) => c.r < -4);
    expect(north).toHaveLength(10);
  });
});
