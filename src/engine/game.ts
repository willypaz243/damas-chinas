import { HexBoard } from "./board";
import type {
  Cell,
  GameState,
  GameConfig,
  PlayerId,
  PlayerConfig,
  HexCoord,
  Move,
  MoveType,
  ValidationResult,
  MoveResult,
  SelectionResult,
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
    // Usar coordenadas del test de referencia basadas en la geometría del tablero
    // Jugador 1 (bottom): filas -4 a 0
    // Jugador 2 (top): filas 0 a 4
    
    const initialPositions: { [key: number]: [number, number][] } = {
      0: [
        [0, -4], [1, -4], [2, -4], [3, -4], [4, -4],
        [0, -3], [1, -3], [2, -3], [3, -3],
        [0, -2],
      ],
      1: [
        [0, 4], [-1, 4], [-2, 4], [-3, 4], [-4, 4],
        [0, 3], [-1, 3], [-2, 3], [-3, 3],
        [0, 2],
      ],
      2: [
        [4, 0], [4, -1], [4, -2], [4, -3], [4, -4],
        [3, 0], [3, -1], [3, -2], [3, -3],
        [2, 0],
      ],
      3: [
        [-4, 0], [-4, 1], [-4, 2], [-4, 3], [-4, 4],
        [-3, 0], [-3, 1], [-3, 2], [-3, 3],
        [-2, 0],
      ],
      4: [
        [4, -4], [3, -5], [2, -5], [1, -4], [0, -3],
        [3, -4], [2, -4], [1, -3], [0, -4],
        [2, -3],
      ],
      5: [
        [-4, 4], [-3, 5], [-2, 5], [-1, 4], [0, 3],
        [-3, 4], [-2, 4], [-1, 3], [0, 4],
        [-2, 3],
      ],
    };

    for (let i = 0; i < config.players.length; i++) {
      const player = config.players[i];
      const positions = initialPositions[i] || [];
      
      for (const [q, r] of positions) {
        if (HexBoard.isValidPosition(q, r)) {
          const key = `${q},${r}`;
          const cell = this.gameState.board.get(key);
          if (cell) {
            cell.pieceColor = player.color;
            cell.piecePlayerId = player.id;
          }
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
    const isAdjacent = neighbors.some(
      (n) => n.q === to.q && n.r === to.r
    );

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
          const targetCell = this.gameState.board.get(HexBoard.getKey(jumpTarget));
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
    this.gameState.players.forEach((player) => {
      player.piecesInTarget = 0;
    });

    this.gameState.board.forEach((cell) => {
      if (cell.piecePlayerId !== null && cell.pieceColor !== null) {
        const playerIndex = this.gameState.players.findIndex(
          (p) => p.id === cell.piecePlayerId
        );
        if (playerIndex !== -1) {
          this.gameState.players[playerIndex].piecesInTarget++;
        }
      }
    });
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
        const targetCell = this.gameState.board.get(HexBoard.getKey(jumpTarget));
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
    this.gameState.currentPlayer = this.gameState.players[this.gameState.currentPlayerIndex];
    this.gameState.selectedPiece = null;
    this.gameState.validMoves = [];
    return true;
  }

  getNextPlayerId(): PlayerId {
    const nextIndex = (this.gameState.currentPlayerIndex + 1) % this.gameState.players.length;
    return this.gameState.players[nextIndex].id;
  }

  getPreviousPlayerId(): PlayerId {
    const prevIndex = 
      (this.gameState.currentPlayerIndex - 1 + this.gameState.players.length) % 
      this.gameState.players.length;
    return this.gameState.players[prevIndex].id;
  }

  checkVictory(): PlayerConfig | null {
    const targetZones = [
      [{ q: 0, r: 4 }, { q: 1, r: 3 }, { q: 2, r: 2 }, { q: 3, r: 1 }, { q: 4, r: 0 }],
      [{ q: 0, r: -4 }, { q: -1, r: -3 }, { q: -2, r: -2 }, { q: -3, r: -1 }, { q: -4, r: 0 }],
      [{ q: -4, r: 0 }, { q: -3, r: -1 }, { q: -2, r: -2 }, { q: -1, r: -3 }, { q: 0, r: -4 }],
      [{ q: 4, r: 0 }, { q: 3, r: 1 }, { q: 2, r: 2 }, { q: 1, r: 3 }, { q: 0, r: 4 }],
      [{ q: -4, r: 4 }, { q: -3, r: 3 }, { q: -2, r: 2 }, { q: -1, r: 1 }, { q: 0, r: 0 }],
      [{ q: 4, r: -4 }, { q: 3, r: -3 }, { q: 2, r: -2 }, { q: 1, r: -1 }, { q: 0, r: 0 }],
    ];

    for (const player of this.gameState.players) {
      const playerPieces = this.countPlayerPiecesInTarget(player.id, targetZones);
      if (playerPieces >= 10) {
        return player;
      }
    }

    return null;
  }

  private countPlayerPiecesInTarget(
    playerId: PlayerId,
    targetZones: HexCoord[][]
  ): number {
    let count = 0;
    
    targetZones.forEach((zone) => {
      zone.forEach((coord) => {
        const cell = this.gameState.board.get(HexBoard.getKey(coord));
        if (cell?.piecePlayerId === playerId) {
          count++;
        }
      });
    });

    return count;
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
