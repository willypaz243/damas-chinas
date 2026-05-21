export type PlayerId = 1 | 2;

export interface PlayerConfig {
  id: PlayerId;
  color: string; // valor HEX del color
  label: string; // ej: 'Jugador 1'
  piecesInTarget: number;
  pointIndex: number; // punta inicial (0=Sur, 1=Norte)
}

export interface HexCoord {
  q: number;
  r: number;
}

export interface Cell {
  coord: HexCoord;
  pieceColor: string | null;
  piecePlayerId: PlayerId | null;
}

export type MoveType = "step" | "jump";

export interface Move {
  from: HexCoord;
  to: HexCoord;
  type: MoveType;
  player: PlayerConfig;
  turnNumber: number;
  timestamp: number;
}

export interface GameConfig {
  playerCount: 2;
  players: PlayerConfig[];
  firstPlayerId: PlayerId;
}

export interface GameState {
  board: Map<string, Cell>;
  players: PlayerConfig[];
  currentPlayerIndex: number;
  currentPlayer: PlayerConfig;
  moveHistory: Move[];
  selectedPiece: HexCoord | null;
  validMoves: HexCoord[];
  winner: PlayerConfig | null;
  isGameOver: boolean;
}

export interface GameEngine {
  getConfig(): GameConfig;
  getState(): GameState;
  selectPiece(coord: HexCoord): SelectionResult;
  executeMove(from: HexCoord, to: HexCoord): MoveResult;
  switchTurn(): void;
  checkVictory(): PlayerConfig | null;
  undoLastMove(): boolean;
  reset(config: GameConfig): GameState;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}
export interface MoveResult {
  success: boolean;
  move?: Move;
  error?: string;
}
export interface SelectionResult {
  success: boolean;
  validMoves?: HexCoord[];
}
