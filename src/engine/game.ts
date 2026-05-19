import { HexBoard } from "./board";
import type {
  GameConfig,
  GameState,
  HexCoord,
  Move,
  MoveResult,
  MoveType,
  PlayerConfig,
  PlayerId,
  SelectionResult,
  ValidationResult,
} from "./types";

export class GameEngine {
  private board: HexBoard;
  private gameState: GameState;
  private moveHistory: Move[] = [];
  private snapshotStack: GameState[] = [];

  constructor() {
    this.board = new HexBoard();
    this.gameState = {
      board: this.board.getBoard(),
      players: [],
      playerCount: 2,
      currentPlayerIndex: 0,
      currentPlayer: {
        id: 1,
        color: "",
        label: "",
        piecesInTarget: 0,
      },
      moveHistory: [],
      selectedPiece: null,
      validMoves: [],
      winner: null,
      isGameOver: false,
    };
  }

  getConfig(): GameConfig {
    return {
      playerCount: this.gameState.playerCount,
      players: this.gameState.players,
      firstPlayerId: this.gameState.players[0]?.id || 1,
    };
  }

  getState(): GameState {
    return this.gameState;
  }

  reset(config: GameConfig): GameState {
    this.gameState = {
      board: this.board.getBoard(),
      players: config.players,
      playerCount: config.playerCount,
      currentPlayerIndex: 0,
      currentPlayer: config.players[0],
      moveHistory: [],
      selectedPiece: null,
      validMoves: [],
      winner: null,
      isGameOver: false,
    };

    this.initializePieces(config);

    return this.gameState;
  }

  private initializePieces(config: GameConfig): void {
    for (const player of config.players) {
      const positions = HexBoard.getInitialPositions(player.pointIndex);

      for (const coord of positions) {
        const key = HexBoard.getKey(coord);
        const cell = this.gameState.board.get(key);
        if (cell) {
          cell.pieceColor = player.color;
          cell.piecePlayerId = player.id;
        }
      }
    }
  }

  canMove(from: HexCoord, to: HexCoord): ValidationResult {
    const fromCell = this.gameState.board.get(HexBoard.getKey(from));

    if (!fromCell) {
      return { valid: false, reason: "no_piece" };
    }

    if (!fromCell.piecePlayerId) {
      return { valid: false, reason: "no_piece" };
    }

    if (fromCell.piecePlayerId !== this.gameState.currentPlayer.id) {
      return { valid: false, reason: "wrong_player" };
    }

    const toCell = this.gameState.board.get(HexBoard.getKey(to));

    if (!toCell) {
      return { valid: false, reason: "invalid_position" };
    }

    if (toCell.pieceColor !== null) {
      return { valid: false, reason: "occupied" };
    }

    const neighbors = this.board.getNeighbors(from);
    const isAdjacent = neighbors.some((n) => n.q === to.q && n.r === to.r);

    if (isAdjacent) {
      return { valid: true };
    }

    const canJump = this.checkJumpMove(from, to);
    if (canJump) {
      return { valid: true };
    }

    return { valid: false, reason: "not_adjacent" };
  }

  private checkJumpMove(from: HexCoord, to: HexCoord): boolean {
    const fromCell = this.gameState.board.get(HexBoard.getKey(from));
    if (!fromCell) return false;

    const neighbors = this.board.getNeighbors(from);

    for (const neighbor of neighbors) {
      const neighborCell = this.gameState.board.get(HexBoard.getKey(neighbor));
      if (neighborCell?.pieceColor !== null) {
        const jumpTarget = {
          q: neighbor.q + (neighbor.q - from.q),
          r: neighbor.r + (neighbor.r - from.r),
        };

        if (jumpTarget.q === to.q && jumpTarget.r === to.r) {
          const targetCell = this.gameState.board.get(
            HexBoard.getKey(jumpTarget),
          );
          if (targetCell?.pieceColor === null) {
            return true;
          }
        }
      }
    }

    return false;
  }

  executeMove(from: HexCoord, to: HexCoord): MoveResult {
    const validation = this.canMove(from, to);

    if (!validation.valid) {
      return { success: false, error: validation.reason };
    }

    this.saveSnapshot();

    const fromCell = this.gameState.board.get(HexBoard.getKey(from));
    if (!fromCell) {
      return { success: false, error: "no_piece" };
    }

    const toCell = this.gameState.board.get(HexBoard.getKey(to));
    if (!toCell) {
      return { success: false, error: "invalid_position" };
    }

    const moveType: MoveType = this.checkJumpMove(from, to) ? "jump" : "step";

    const move: Move = {
      from,
      to,
      type: moveType,
      player: this.gameState.currentPlayer,
      turnNumber: this.gameState.moveHistory.length + 1,
      timestamp: Date.now(),
    };

    toCell.pieceColor = fromCell.pieceColor;
    toCell.piecePlayerId = fromCell.piecePlayerId;
    fromCell.pieceColor = null;
    fromCell.piecePlayerId = null;

    this.gameState.moveHistory.push(move);
    this.gameState.selectedPiece = null;
    this.gameState.validMoves = [];

    this.updatePlayerProgress();

    const nextTurn = this.switchTurn();

    const winner = this.checkVictory();
    if (winner) {
      this.gameState.winner = winner;
      this.gameState.isGameOver = true;
    }

    return { success: true, move, chainComplete: !nextTurn };
  }

  private updatePlayerProgress(): void {
    for (const player of this.gameState.players) {
      player.piecesInTarget = 0;
      const targetZone = HexBoard.getTargetZone(player.pointIndex);
      for (const coord of targetZone) {
        const cell = this.gameState.board.get(HexBoard.getKey(coord));
        if (cell?.piecePlayerId === player.id) {
          player.piecesInTarget++;
        }
      }
    }
  }

  selectPiece(coord: HexCoord): SelectionResult {
    const cell = this.gameState.board.get(HexBoard.getKey(coord));

    if (!cell || !cell.piecePlayerId) {
      return { success: false };
    }

    if (cell.piecePlayerId !== this.gameState.currentPlayer.id) {
      return { success: false, validMoves: [], forcedJump: false };
    }

    const validMoves = this.getValidMoves(coord);

    this.gameState.selectedPiece = coord;
    this.gameState.validMoves = validMoves;

    return { success: true, validMoves, forcedJump: false };
  }

  getValidMoves(coord: HexCoord): HexCoord[] {
    const validMoves: HexCoord[] = [];
    const neighbors = this.board.getNeighbors(coord);

    for (const neighbor of neighbors) {
      const neighborCell = this.gameState.board.get(HexBoard.getKey(neighbor));
      if (neighborCell?.pieceColor === null) {
        validMoves.push(neighbor);
      }
    }

    for (const neighbor of neighbors) {
      const neighborCell = this.gameState.board.get(HexBoard.getKey(neighbor));
      if (neighborCell?.pieceColor !== null) {
        const jumpTarget = {
          q: neighbor.q + (neighbor.q - coord.q),
          r: neighbor.r + (neighbor.r - coord.r),
        };
        const targetCell = this.gameState.board.get(
          HexBoard.getKey(jumpTarget),
        );
        if (targetCell?.pieceColor === null) {
          validMoves.push(jumpTarget);
        }
      }
    }

    return validMoves;
  }

  switchTurn(): boolean {
    this.gameState.currentPlayerIndex =
      (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
    this.gameState.currentPlayer =
      this.gameState.players[this.gameState.currentPlayerIndex];
    this.gameState.selectedPiece = null;
    this.gameState.validMoves = [];
    return true;
  }

  getNextPlayerId(): PlayerId {
    const nextIndex =
      (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
    return this.gameState.players[nextIndex].id;
  }

  getPreviousPlayerId(): PlayerId {
    const prevIndex =
      (this.gameState.currentPlayerIndex - 1 + this.gameState.players.length) %
      this.gameState.players.length;
    return this.gameState.players[prevIndex].id;
  }

  checkVictory(): PlayerConfig | null {
    for (const player of this.gameState.players) {
      const targetZone = HexBoard.getTargetZone(player.pointIndex);
      let count = 0;
      for (const coord of targetZone) {
        const cell = this.gameState.board.get(HexBoard.getKey(coord));
        if (cell?.piecePlayerId === player.id) {
          count++;
        }
      }
      if (count >= 10) {
        return player;
      }
    }

    return null;
  }

  undoLastMove(): boolean {
    if (this.snapshotStack.length === 0) {
      return false;
    }

    this.gameState = this.snapshotStack.pop()!;
    return true;
  }

  private saveSnapshot(): void {
    const stateCopy: GameState = {
      board: new Map(this.gameState.board),
      players: [...this.gameState.players],
      playerCount: this.gameState.playerCount,
      currentPlayerIndex: this.gameState.currentPlayerIndex,
      currentPlayer: { ...this.gameState.currentPlayer },
      moveHistory: [...this.gameState.moveHistory],
      selectedPiece: this.gameState.selectedPiece,
      validMoves: [...this.gameState.validMoves],
      winner: this.gameState.winner,
      isGameOver: this.gameState.isGameOver,
    };

    this.snapshotStack.push(stateCopy);
  }
}
