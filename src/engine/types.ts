export type PlayerId = 1 | 2 | 3 | 4 | 5 | 6;

export interface PlayerConfig {
  id: PlayerId;
  color: string;
  label: string;
  piecesInTarget: number;
  pointIndex: number;
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
  intermediatePositions?: HexCoord[];
}

export interface GameConfig {
  playerCount: 2 | 3 | 4 | 5 | 6;
  players: PlayerConfig[];
  firstPlayerId: PlayerId;
}

export interface GameState {
  board: Map<string, Cell>;
  players: PlayerConfig[];
  playerCount: 2 | 3 | 4 | 5 | 6;
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
  canMove(from: HexCoord, to: HexCoord): ValidationResult;
  executeMove(from: HexCoord, to: HexCoord): MoveResult;
  selectPiece(coord: HexCoord): SelectionResult;
  getValidMoves(coord: HexCoord): HexCoord[];
  checkVictory(): PlayerConfig | null;
  switchTurn(): void;
  getNextPlayerId(): PlayerId;
  getPreviousPlayerId(): PlayerId;
  undoLastMove(): boolean;
  reset(config: GameConfig): GameState;
}

export interface BoardRenderer {
  render(state: GameState): void;
  onCellClick(coord: HexCoord): void;
  onPieceHover(coord: HexCoord): void;
}

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export interface MoveResult {
  success: boolean;
  move?: Move;
  error?: string;
  chainComplete?: boolean;
}

export interface SelectionResult {
  success: boolean;
  validMoves?: HexCoord[];
  forcedJump?: boolean;
}

export interface PlayerPoint {
  id: number;
  label: string;
  coord: HexCoord;
  occupiedBy?: PlayerId;
}

export type PlayerSetupState = {
  playerCount: 2 | 3 | 4 | 5 | 6;
  selectedPoints: number[];
  players: PlayerConfig[];
};
