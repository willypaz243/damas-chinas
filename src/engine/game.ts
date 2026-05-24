import type { GameConfig, GameEngine as IGameEngine, GameState, HexCoord, Cell, PlayerConfig, SelectionResult, MoveResult, Move } from './types';
import { HexBoard } from './board';

export class GameEngine implements IGameEngine {
  private config: GameConfig;
  private state!: GameState;
  private board: HexBoard;
  private snapshots: GameState[];

  constructor(config: GameConfig) {
    this.config = config;
    this.board = new HexBoard();
    this.snapshots = [];
    this.state = this.buildInitialState();
  }

  private cellKey(q: number, r: number): string {
    return `${q},${r}`;
  }

  private buildInitialState(): GameState {
    const board = new Map<string, Cell>();
    for (const { q, r } of this.board.getAllCells()) {
      const coord = { q, r };
      board.set(`${q},${r}`, { coord, pieceColor: null, piecePlayerId: null });
    }

    for (const player of this.config.players) {
      const isSouth = player.pointIndex === 0;
      for (const { q, r } of this.board.getAllCells()) {
        if (isSouth && r > 4) {
          board.set(`${q},${r}`, { coord: { q, r }, pieceColor: player.color, piecePlayerId: player.id });
        } else if (!isSouth && r < -4) {
          board.set(`${q},${r}`, { coord: { q, r }, pieceColor: player.color, piecePlayerId: player.id });
        }
      }
    }

    const firstPlayer = this.config.players.find(p => p.id === this.config.firstPlayerId)!;

    return {
      board,
      players: this.config.players,
      currentPlayerIndex: 0,
      currentPlayer: firstPlayer,
      moveHistory: [],
      selectedPiece: null,
      validMoves: [],
      winner: null,
      isGameOver: false,
    };
  }

  private getCell(q: number, r: number): Cell | undefined {
    return this.state.board.get(this.cellKey(q, r));
  }

  private getStepMoves(coord: HexCoord): HexCoord[] {
    return this.board.getNeighbors(coord.q, coord.r)
      .filter(n => {
        const cell = this.getCell(n.q, n.r);
        return cell && cell.pieceColor === null;
      });
  }

  private findJumpChain(coord: HexCoord, visited: Set<string> = new Set()): HexCoord[] {
    const jumps: HexCoord[] = [];
    const key = this.cellKey(coord.q, coord.r);
    if (visited.has(key)) return jumps;
    visited = new Set(visited);
    visited.add(key);

    const neighbors = this.board.getNeighbors(coord.q, coord.r);

    for (const n of neighbors) {
      const nCell = this.getCell(n.q, n.r);
      if (!nCell || nCell.pieceColor === null) continue;

      const dq = n.q - coord.q;
      const dr = n.r - coord.r;
      const beyond: HexCoord = { q: n.q + dq, r: n.r + dr };
      const bCell = this.getCell(beyond.q, beyond.r);
      if (bCell && bCell.pieceColor === null) {
        jumps.push(beyond);
        jumps.push(...this.findJumpChain(beyond, visited));
      }
    }

    return jumps;
  }

  getValidMoves(coord: HexCoord): HexCoord[] {
    if (!this.board.isValidPosition(coord.q, coord.r)) return [];
    const cell = this.getCell(coord.q, coord.r);
    if (!cell || cell.pieceColor === null) return [];

    return [...this.getStepMoves(coord), ...this.findJumpChain(coord)];
  }

  private getTargetZoneCells(player: PlayerConfig): HexCoord[] {
    if (player.pointIndex === 0) {
      return this.board.getAllCells().filter(c => c.r < -4);
    }
    return this.board.getAllCells().filter(c => c.r > 4);
  }

  private cloneBoard(board: Map<string, Cell>): Map<string, Cell> {
    const clone = new Map<string, Cell>();
    for (const [key, cell] of board) {
      clone.set(key, { ...cell, coord: { ...cell.coord } });
    }
    return clone;
  }

  private saveSnapshot(): void {
    this.snapshots.push({
      board: this.cloneBoard(this.state.board),
      players: this.state.players.map(p => ({ ...p })),
      currentPlayer: { ...this.state.currentPlayer },
      currentPlayerIndex: this.state.currentPlayerIndex,
      moveHistory: this.state.moveHistory.map(m => ({
        from: { ...m.from },
        to: { ...m.to },
        type: m.type,
        player: { ...m.player },
        turnNumber: m.turnNumber,
        timestamp: m.timestamp,
      })),
      selectedPiece: this.state.selectedPiece ? { ...this.state.selectedPiece } : null,
      validMoves: [...this.state.validMoves],
      winner: this.state.winner ? { ...this.state.winner } : null,
      isGameOver: this.state.isGameOver,
    });
  }

  private setSelection(coord: HexCoord | null, moves: HexCoord[]): void {
    this.state = { ...this.state, selectedPiece: coord, validMoves: moves };
  }

  private isValidMove(from: HexCoord, to: HexCoord): boolean {
    const validMoves = this.getValidMoves(from);
    return validMoves.some(m => m.q === to.q && m.r === to.r);
  }

  selectPiece(coord: HexCoord): SelectionResult {
    if (!this.board.isValidPosition(coord.q, coord.r)) {
      return { success: false };
    }

    const cell = this.getCell(coord.q, coord.r);
    if (!cell || cell.pieceColor === null) {
      return { success: false };
    }

    if (cell.piecePlayerId !== this.state.currentPlayer.id) {
      return { success: false };
    }

    const validMoves = this.getValidMoves(coord);
    this.setSelection(coord, validMoves);
    return { success: true, validMoves };
  }

  executeMove(from: HexCoord, to: HexCoord): MoveResult {
    const fromCell = this.getCell(from.q, from.r);
    if (!fromCell || fromCell.pieceColor === null) {
      return { success: false, error: 'no piece at origin' };
    }

    if (fromCell.piecePlayerId !== this.state.currentPlayer.id) {
      return { success: false, error: 'not your piece' };
    }

    const toCell = this.getCell(to.q, to.r);
    if (!toCell || toCell.pieceColor !== null) {
      return { success: false, error: 'destination occupied or invalid' };
    }

    if (!this.isValidMove(from, to)) {
      return { success: false, error: 'invalid move' };
    }

    this.saveSnapshot();

    const move: Move = {
      from,
      to,
      type: this.board.getNeighbors(from.q, from.r).some(n => n.q === to.q && n.r === to.r)
        ? 'step'
        : 'jump',
      player: { ...this.state.currentPlayer },
      turnNumber: this.state.moveHistory.length + 1,
      timestamp: Date.now(),
    };

    const newBoard = new Map(this.state.board);
    newBoard.set(this.cellKey(from.q, from.r), {
      coord: from,
      pieceColor: null,
      piecePlayerId: null,
    });
    newBoard.set(this.cellKey(to.q, to.r), {
      coord: to,
      pieceColor: fromCell.pieceColor,
      piecePlayerId: fromCell.piecePlayerId,
    });

    this.state = {
      ...this.state,
      board: newBoard,
      moveHistory: [...this.state.moveHistory, move],
      selectedPiece: null,
      validMoves: [],
    };

    const winner = this.checkVictory();
    if (winner) {
      this.state = {
        ...this.state,
        winner,
        isGameOver: true,
      };
    } else {
      this.switchTurn();
    }
    return { success: true, move };
  }

  switchTurn(): void {
    const nextIndex = (this.state.currentPlayerIndex + 1) % this.config.players.length;
    this.state = {
      ...this.state,
      currentPlayerIndex: nextIndex,
      currentPlayer: this.config.players[nextIndex],
      selectedPiece: null,
      validMoves: [],
    };
  }

  checkVictory(): PlayerConfig | null {
    for (const player of this.config.players) {
      const targetCells = this.getTargetZoneCells(player);
      let count = 0;
      for (const tc of targetCells) {
        const cell = this.getCell(tc.q, tc.r);
        if (cell && cell.piecePlayerId === player.id) {
          count++;
        }
      }
      if (count === targetCells.length) {
        return player;
      }
    }
    return null;
  }

  undoLastMove(): boolean {
    if (this.state.isGameOver) return false;
    if (this.snapshots.length === 0) return false;

    this.state = this.snapshots.pop()!;
    return true;
  }

  getConfig(): GameConfig {
    return { ...this.config };
  }

  getState(): GameState {
    return this.state;
  }

  reset(config: GameConfig): GameState {
    this.config = config;
    this.board = new HexBoard();
    this.snapshots = [];
    this.state = this.buildInitialState();
    return this.state;
  }
}
