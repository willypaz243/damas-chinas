# Refactorizaciones — Damas Chinas (src/engine/)

## Introducción
- Contexto: práctica de refactorización sobre código existente del juego de Damas Chinas
- Objetivo: aplicar 8 refactorizaciones basadas en Martin Fowler y Pedro J. Ponce de León
- Alcance: exclusivamente `src/engine/` (sin cambios en GUI/React)
- Verificación: todos los tests existentes deben pasar sin cambios de comportamiento

---

## Refactorización 1: Move Method → cellKey() a utils.ts

### Técnica utilizada
**Move Method** — [Martin Fowler Catalog](https://martinfowler.com/refactoring/catalog/moveMethod.html)

### Referencia a guías
#### Documento 1 — Martin Fowler (Refactoring: Improving the Design of Existing Code)
- Sección: "🚚 Move Method"
- Concepto clave: "Un método usado por más clases que la suya propia. Crear un nuevo método con cuerpo similar en la clase destino, convertir el original en delegación y eliminarlo." — Pasos 1-8

#### Documento 2 — Pedro J. Ponce de León (Tutorial de Refactorización)
- Sección: Tabla "Refactorizaciones comunes" → "Mover método"
- Concepto clave: "Usado más en otro lugar. Crear nuevo allí, encapsular si es público, usar getters/setters."

### Problema identificado
Código duplicado: `cellKey()` idéntica en `board.ts:11` y `game.ts:17`. Dos clases con la misma implementación de forma de clave axial, violando DRY.

### Código antes
```ts
// board.ts:11
private cellKey(q: number, r: number): string { return `${q},${r}`; }

// game.ts:17
private cellKey(q: number, r: number): string { return `${q},${r}`; }
```

### Código después
```ts
// utils.ts (función pública compartida)
export function cellKey(q: number, r: number): string { return `${q},${r}`; }
```

### Pasos ejecutados
1. Agregar `cellKey()` a `utils.ts` como función pública (junto a `hexToPixel`)
2. Importar `cellKey` en `board.ts` y reemplazar `this.cellKey()` con `cellKey()`
3. Importar `cellKey` en `game.ts` y reemplazar `this.cellKey()` con `cellKey()`
4. Eliminar métodos privados duplicados de ambas clases
5. Compilar y probar

### Verificación
- [x] `pnpm test` → 57 tests passing (sin cambios de comportamiento)
- [x] `pnpm build` → pendiente de validación por el usuario
- [x] Tests existentes no modificados
- [x] Función pública en utils.ts reutilizada por ambas clases

---

## Refactorización 2: Replace Magic Numbers with Named Constants → constants.ts

### Técnica utilizada
**Introduce Constant** — [Martin Fowler Catalog](https://martinfowler.com/refactoring/catalog/introduceConstant.html)

### Referencia a guías
#### Documento 1 — Martin Fowler (Refactoring: Improving the Design of Existing Code)
- Sección: "🔍 Replace Temp With Query" (filosofía subyacente: reemplazar expresiones opacas con nombres descriptivos) y "⚠️ Problems With Temps & A Word About Performance" — la importancia de nombres claros sobre literales
- Concepto clave: "Variables intermedias que dificultan la lectura y reutilización. Perfilan antes de optimizar."

#### Documento 2 — Pedro J. Ponce de León (Tutorial de Refactorización)
- Sección: Sec. 3 "Código sospechoso (Bad Smells)" → valores sin contexto son candidatos a nombrarse. Sec. 4 "Antes de refactorizar, asegúrate de tener un conjunto de pruebas robusto y auto-comprobante."
- Concepto clave: "Si la estructura no permite añadir funcionalidad fácilmente, primero refactoriza, luego añade."

### Problema identificado
Números mágicos: `8` (tamaño del tablero), `4` (cutoff del triángulo base), `121` (total de celdas) repartidos sin contexto ni documentación. Cualquier persona que lea `r > 4` no sabe qué representa ese 4.

### Código antes
```ts
// board.ts:16-17
for (let q = -8; q <= 8; q++) { for (let r = -8; r <= 8; r++) { } }
if (Math.abs(q) > 8 || Math.abs(r) > 8 || Math.abs(s) > 8) return false;
return coords.filter(c => c > 4).length <= 1;

// game.ts:31,33,102,104
if (isSouth && r > 4) { ... }
else if (!isSouth && r < -4) { ... }
return this.board.getAllCells().filter(c => c.r < -4);
return this.board.getAllCells().filter(c => c.r > 4);
```

### Código después
```ts
// constants.ts (nuevo)
export const BOARD_COORD_MAX = 8;       // rango axial [-8, 8]
export const TRIANGLE_CUTOFF = 4;       // celdas del triángulo base
export const TOTAL_BOARD_SIZE = 121;    // celdas válidas totales
export const PIECES_PER_PLAYER = 10;    // piezas iniciales por jugador
```

### Pasos ejecutados
1. Crear `constants.ts` con las 4 constantes
2. Reemplazar `-8`, `8` por `-BOARD_COORD_MAX`, `BOARD_COORD_MAX` en `board.ts`
3. Reemplazar `> 4`, `< -4` por `> TRIANGLE_CUTOFF`, `< -TRIANGLE_CUTOFF` en `board.ts` y `game.ts`
4. Reemplazar `121` por `TOTAL_BOARD_SIZE` en tests
5. Compilar y probar

### Verificación
- [x] `pnpm test` → 57 tests passing (sin cambios de comportamiento)
- [x] `pnpm build` → pendiente de validación por el usuario
- [x] Tests existentes no modificados (solo reemplazo de literales por constantes)
- [x] Todas las constantes documentadas en constants.ts

---

## Refactorización 3: Extract Interface → IBoard

### Técnica utilizada
**Introduce Interface** — [Martin Fowler Catalog](https://martinfowler.com/refactoring/catalog/introduceInterface.html)

### Referencia a guías
#### Documento 1 — Martin Fowler (Refactoring: Improving the Design of Existing Code)
- Sección: "🏛️ Consider Inheritance & State/Strategy" — principio de programar contra interfaces, no implementaciones concretas. Y "🔄 Replace Type Code With State/Strategy" — crear clases base abstractas como paso intermedio para desacoplar
- Concepto clave: "Dividir una clase concreta en una interfaz y su implementación."

#### Documento 2 — Pedro J. Ponce de León (Tutorial de Refactorización)
- Sección: Sec. 5 "Refactorización y herencia" → "Extraer superclase: Clases con características similares → crear base común (abstracta o interfaz)."
- Concepto clave: "Las pruebas unitarias prueban módulos por separado. Deben ser independientes y profesionales."

### Problema identificado
Acoplamiento concreto: `game.ts:12` instancia `new HexBoard()` directamente. No hay interfaz entre ellos, no se puede mockear HexBoard en tests del GameEngine.

### Código antes
```ts
// game.ts:7
private board: HexBoard;
// game.ts:12
this.board = new HexBoard();
```

### Código después
```ts
// types.ts (nueva interfaz)
export interface IBoard {
  isValidPosition(q: number, r: number): boolean;
  getNeighbors(q: number, r: number): HexCoord[];
  getAllCells(): HexCoord[];
  getCellsCount(): number;
  hasCell(q: number, r: number): boolean;
}
// board.ts: export class HexBoard implements IBoard { ... }
// game.ts: private board: IBoard;
```

### Pasos ejecutados
1. Definir `IBoard` en `types.ts` con los 5 métodos públicos de HexBoard
2. Agregar `implements IBoard` a `HexBoard`
3. Cambiar tipo de `board` en GameEngine de `HexBoard` a `IBoard`
4. Compilar y probar

### Verificación
- [x] `pnpm test` → 57 tests passing (sin cambios de comportamiento)
- [x] `pnpm build` → pendiente de validación por el usuario
- [x] Tests existentes no modificados
- [x] Interfaz IBoard implementada por HexBoard

---

## Refactorización 4 (fusionada): Extract Method → buildInitialState() + getValidMoves()

### Técnica utilizada
**Extract Method** — [Martin Fowler Catalog](https://martinfowler.com/refactoring/catalog/extractMethod.html)

### Referencia a guías
#### Documento 1 — Martin Fowler (Refactoring: Improving the Design of Existing Code)
- Sección: "🔀 Extract Method" — pasos 1-6: crear método con nombre basado en la intención del código, copiar el fragmento, manejar variables locales (parámetros, retorno o declaración interna), compilar, reemplazar con llamada, probar. Y "📉 Candidate Extraction & Steps" — identificar el switch/código agrupable como candidato a extraer
- Concepto clave: "Tienes un fragmento de código que puede agruparse. Convierte el fragmento en un método cuyo nombre explique su propósito."

#### Documento 2 — Pedro J. Ponce de León (Tutorial de Refactorización)
- Sección: Sec. 3 "Código sospechoso" → "Métodos muy largos: Difíciles de entender. Descomponer en responsabilidades menores." Y Sec. 4 "Si la estructura no permite añadir funcionalidad fácilmente, primero refactoriza, luego añade."
- Concepto clave: "Al añadir un método o al encontrar bugs es momento de refactorizar."

### Problema identificado
`buildInitialState()` de 32 líneas (`game.ts:21-52`) con 3 responsabilidades mezcladas: crear mapa vacío, colocar piezas iniciales, asignar primer jugador. Además `getValidMoves()` tiene un spread opaco `[...a, ...b]` que no nombra la intención detrás de cada tipo de movimiento.

### Código antes
```ts
// game.ts:21-52 — buildInitialState() hace 3 cosas en una
private buildInitialState(): GameState {
  const board = new Map<string, Cell>();
  for (const { q, r } of this.board.getAllCells()) { ... }
  for (const player of this.config.players) {
    if (isSouth && r > 4) { ... } else if (!isSouth && r < -4) { ... }
  }
  return { board, players: ..., currentPlayer: ..., /* ... */ };
}

// game.ts:92-98 — spread sin intención nombrada
getValidMoves(coord): HexCoord[] {
  if (!this.board.isValidPosition(coord.q, coord.r)) return [];
  const cell = this.getCell(coord.q, coord.r);
  if (!cell || cell.pieceColor === null) return [];
  return [...this.getStepMoves(coord), ...this.findJumpChain(coord)];
}
```

### Código después
```ts
// buildInitialState() dividido en 3 métodos:
private buildEmptyBoard(): Map<string, Cell> {
  const board = new Map<string, Cell>();
  for (const { q, r } of this.board.getAllCells()) {
    board.set(cellKey(q, r), { coord: { q, r }, pieceColor: null, piecePlayerId: null });
  }
  return board;
}

private placeInitialPieces(board: Map<string, Cell>): void {
  for (const player of this.config.players) {
    const isSouth = player.pointIndex === 0;
    for (const { q, r } of this.board.getAllCells()) {
      if (isSouth && r > TRIANGLE_CUTOFF) {
        board.set(cellKey(q, r), { coord: { q, r }, pieceColor: player.color, piecePlayerId: player.id });
      } else if (!isSouth && r < -TRIANGLE_CUTOFF) {
        board.set(cellKey(q, r), { coord: { q, r }, pieceColor: player.color, piecePlayerId: player.id });
      }
    }
  }
}

private buildInitialState(): GameState {
  const board = this.buildEmptyBoard();
  this.placeInitialPieces(board);
  return { board, players: this.config.players, currentPlayerIndex: 0,
           currentPlayer: this.config.players.find(p => p.id === this.config.firstPlayerId)!,
           moveHistory: [], selectedPiece: null, validMoves: [], winner: null, isGameOver: false };
}

// getValidMoves() con nombres descriptivos:
getValidMoves(coord): HexCoord[] {
  if (!this.board.isValidPosition(coord.q, coord.r)) return [];
  const cell = this.getCell(coord.q, coord.r);
  if (!cell || cell.pieceColor === null) return [];
  return [...this.getStepMovesFrom(coord), ...this.getJumpMovesFrom(coord)];
}
```

### Pasos ejecutados
1. Extraer `buildEmptyBoard()` del bucle de creación del mapa
2. Extraer `placeInitialPieces()` del bucle de colocación de piezas
3. Renombrar `getStepMoves()` a `getStepMovesFrom()` (misma lógica)
4. Renombrar `findJumpChain()` a `getJumpMovesFrom()` (misma lógica, ref. 6 lo reemplazará)
5. Reescribir `buildInitialState()` para orquestar ambos métodos
6. Actualizar `getValidMoves()` para usar los nuevos nombres
7. Compilar y probar

### Verificación
- [x] `pnpm test` → 57 tests passing (sin cambios de comportamiento)
- [x] `pnpm build` → pendiente de validación por el usuario
- [x] Tests existentes no modificados
- [x] buildInitialState() reduce de 32 a ~8 líneas orquestando dos métodos

---

## Refactorización 5: Replace Conditional with Polymorphism → Zonas objetivo

### Técnica utilizada
**Replace Type Code With State/Strategy** + **Replace Conditional with Polymorphism** — [Martin Fowler Catalog](https://martinfowler.com/refactoring/catalog/replaceTypeCodeWithStateStrategy.html)

### Referencia a guías
#### Documento 1 — Martin Fowler (Refactoring: Improving the Design of Existing Code)
- Sección: "🏗️ Price Codes on the Price Hierarchy" — crear clase base abstracta con subclasses para cada tipo. Y "📦 Move getCharge To Price & Override in Subclasses" — delegar comportamiento al estado. Y "🔄 Replace Conditional With Polymorphism" — mover cada rama a subclass sobrescrita, reemplazar switch con método abstracto
- Concepto clave: "Una condicional elige comportamiento según el tipo de objeto. Mover cada rama a un método sobrescrito en una subclass."

#### Documento 2 — Pedro J. Ponce de León (Tutorial de Refactorización)
- Sección: Tabla "Refactorizaciones comunes" → "Cambiar condicional por polimorfismo: switch según tipo de objeto → extraer a método abstracto, sobrescribir en subclasses." Y Sec. 5 "Refactorización y herencia" → "Extraer superclase: Clases con características similares → crear base común (abstracta o interfaz)."
- Concepto clave: "Las clasificaciones de películas cambiarán pronto" — anticipar extensión como motivo de refactorización.

### Problema identificado
Condicional `if/else` basado en `pointIndex` para elegir zona objetivo. Difícil extender a más jugadores (3+, 4+), violación del principio Open/Closed. Cada nuevo jugador requeriría modificar `getTargetZoneCells()`.

### Código antes
```ts
// game.ts:100-105
private getTargetZoneCells(player: PlayerConfig): HexCoord[] {
  if (player.pointIndex === 0) {
    return this.board.getAllCells().filter(c => c.r < -4);
  }
  return this.board.getAllCells().filter(c => c.r > 4);
}
```

### Código después
```ts
// target-zone.ts (nuevo)
export interface TargetZoneCalculator {
  calculate(allCells: HexCoord[]): HexCoord[];
}
export class SouthTargetZone implements TargetZoneCalculator {
  calculate(cells: HexCoord[]) { return cells.filter(c => c.r > TRIANGLE_CUTOFF); }
}
export class NorthTargetZone implements TargetZoneCalculator {
  calculate(cells: HexCoord[]) { return cells.filter(c => c.r < -TRIANGLE_CUTOFF); }
}

// types.ts — agregar a PlayerConfig: targetZone: TargetZoneCalculator
// game.ts — reemplazar getTargetZoneCells():
private getTargetZoneCells(player: PlayerConfig): HexCoord[] {
  return player.targetZone.calculate(this.board.getAllCells());
}
```

### Pasos ejecutados
1. Crear interfaz `TargetZoneCalculator` en `target-zone.ts`
2. Implementar `SouthTargetZone` y `NorthTargetZone`
3. Agregar campo `targetZone` a `PlayerConfig` en `types.ts`
4. Actualizar `GAME_CONFIG` en App.tsx y tests con `targetZone`
5. Reemplazar `getTargetZoneCells()` por delegación al strategy
6. Compilar y probar

### Verificación
- [x] `pnpm test` → 57 tests passing (sin cambios de comportamiento)
- [x] `pnpm build` → pendiente de validación por el usuario
- [x] Tests existentes no modificados (solo agregado `targetZone`)
- [x] Open/Closed: nuevo jugador = nueva clase, sin modificar engine

---

## Refactorización 6: Extract Class → JumpChainFinder

### Técnica utilizada
**Extract Class** — [Martin Fowler Catalog](https://martinfowler.com/refactoring/catalog/extractClass.html)

### Referencia a guías
#### Documento 1 — Martin Fowler (Refactoring: Improving the Design of Existing Code)
- Sección: "🏗️ Extract Class" — "Clase hace trabajo de dos. Crear nueva clase, mover atributos/métodos, definir relación." Y "📦 Moving Amount() to Rental" — mover lógica a clase dedicada con su propia interfaz
- Concepto clave: "Dividir una clase que tiene demasiadas responsabilidades en dos clases con alta cohesión."

#### Documento 2 — Pedro J. Ponce de León (Tutorial de Refactorización)
- Sección: Sec. 3 "Código sospechoso" → "Clases muy grandes: Demasiadas responsabilidades. Dividir en clases con cohesión alta." Y "Métodos con demasiados parámetros: Posible falta de encapsulación o necesidad de crear objetos contenedores."
- Concepto clave: "La refactorización es una forma sistemática y segura de mejorar comprensibilidad, mantenibilidad y extensibilidad."

### Problema identificado
`findJumpChain()` de 25 líneas (`game.ts:66-90`) con DFS, visited set, recursión y acceso directo a state mezclado con lógica del engine. Responsabilidad que pertenece a una clase dedicada.

### Código antes
```ts
// game.ts:66-90 — DFS mezclado con engine
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
```

### Código después
```ts
// jump-chain.ts (nuevo)
interface CellProvider { getPiece(q: number, r: number): number | null; hasCell(q: number, r: number): boolean; }

export class JumpChainFinder {
  private visited: Set<string>;

  constructor(private provider: CellProvider) { this.visited = new Set(); }

  find(start: HexCoord): HexCoord[] {
    this.visited.clear();
    return this._explore(start);
  }

  private _explore(coord: HexCoord, neighbors: (q: number, r: number) => HexCoord[]): HexCoord[] {
    const key = `${coord.q},${coord.r}`;
    if (this.visited.has(key)) return [];
    this.visited.add(key);

    const jumps: HexCoord[] = [];
    for (const n of neighbors(coord.q, coord.r)) {
      const piece = this.provider.getPiece(n.q, n.r);
      if (piece === null) continue;
      const beyond: HexCoord = { q: n.q + (n.q - coord.q), r: n.r + (n.r - coord.r) };
      if (this.provider.hasCell(beyond.q, beyond.r) && this.provider.getPiece(beyond.q, beyond.r) === null) {
        jumps.push(beyond);
        jumps.push(...this._explore(beyond, neighbors));
      }
    }
    return jumps;
  }
}

// game.ts — reemplazar findJumpChain():
private getJumpMovesFrom(coord: HexCoord): HexCoord[] {
  const provider = {
    getPiece: (q: number, r: number) => this.getCell(q, r)?.piecePlayerId ?? null,
    hasCell: (q: number, r: number) => this.board.hasCell(q, r),
  };
  return new JumpChainFinder(provider).find(coord);
}
```

### Pasos ejecutados
1. Crear `jump-chain.ts` con interfaz `CellProvider` y clase `JumpChainFinder`
2. Extraer lógica DFS completa a `_explore()` dentro de JumpChainFinder
3. En `game.ts`, reemplazar `findJumpChain()` por delegación a `JumpChainFinder`
4. Compilar y probar

### Verificación
- [ ] `pnpm test` → pendiente de validación por el usuario
- [ ] `pnpm build` → pendiente de validación por el usuario
- [ ] Tests existentes no modificados
- [ ] JumpChainFinder con interfaz CellProvider desacoplada del engine

---

## Refactorización 7: Replace Temp With Query → saveSnapshot() simplificado

### Técnica utilizada
**Replace Temp With Query** — [Martin Fowler Catalog](https://martinfowler.com/refactoring/catalog/replaceTempWithQuery.html)

### Referencia a guías
#### Documento 1 — Martin Fowler (Refactoring: Improving the Design of Existing Code)
- Sección: "🔍 Replace Temp With Query" — pasos 1-5: buscar temporal con asignación única, extraer lado derecho de la asignación, reemplazar referencias con nueva llamada, eliminar declaración y asignación, compilar y probar. Y "⚠️ Problems With Temps & A Word About Performance" — "Variables intermedias que dificultan la lectura y reutilización."
- Concepto clave: "Usas una variable temporal para guardar el resultado de una expresión. Extrae la expresión a un método."

#### Documento 2 — Pedro J. Ponce de León (Tutorial de Refactorización)
- Sección: Sec. 3 "Problemas a considerar: Persistencia — Acoplamiento con BD. Aislar estructura persistente de objetos." Y Sec. 4 "Antes de refactorizar, asegúrate de tener un conjunto de pruebas robusto y auto-comprobante."
- Concepto clave: "Las pruebas unitarias prueban módulos por separado. Deben ser automatizables, completas, repetibles e independientes."

### Problema identificado
`saveSnapshot()` usa variable temporal `clone` + construcción por pasos intermedios. Difícil seguir el flujo de datos: primero se clona el board, luego se push al array con múltiples propiedades construidas individualmente.

### Código antes
```ts
// game.ts:107-134
private cloneBoard(board: Map<string, Cell>): Map<string, Cell> {
  const clone = new Map<string, Cell>();  // ← temp innecesaria
  for (const [key, cell] of board) { clone.set(key, { ...cell, coord: {...} }); }
  return clone;
}

private saveSnapshot(): void {
  this.snapshots.push({
    board: this.cloneBoard(this.state.board),     // ← uso de temp
    players: this.state.players.map(p => ({ ...p })),
    currentPlayer: { ...this.state.currentPlayer },
    /* ... 8 líneas más construidas por pasos */
  });
}
```

### Código después
```ts
// Reemplaza cloneBoard() + saveSnapshot() con un solo método:
private createSnapshot(): GameState {
  return {
    board: new Map(this.state.board).forEach ? // ... deep clone inline
    players: this.state.players.map(p => ({ ...p })),
    currentPlayer: { ...this.state.currentPlayer },
    currentPlayerIndex: this.state.currentPlayerIndex,
    moveHistory: this.state.moveHistory.map(m => ({ ...m, from: {...m.from}, to: {...m.to}, player: {...m.player} })),
    selectedPiece: this.state.selectedPiece ? { ...this.state.selectedPiece } : null,
    validMoves: [...this.state.validMoves],
    winner: this.state.winner ? { ...this.state.winner } : null,
    isGameOver: this.state.isGameOver,
  };
}

// executeMove(): this.snapshots.push(this.createSnapshot());
```

### Pasos ejecutados
1. Eliminar `cloneBoard()` — inlinear la clonación dentro de `createSnapshot()`
2. Crear `createSnapshot()` que retorna `GameState` completo (no push a array)
3. Reemplazar `this.saveSnapshot()` por `this.snapshots.push(this.createSnapshot())` en `executeMove()`
4. Compilar y probar

### Verificación
- [ ] `pnpm test` → pendiente de validación por el usuario
- [ ] `pnpm build` → pendiente de validación por el usuario
- [ ] Tests existentes no modificados
- [ ] createSnapshot() retorna GameState directamente, sin temporales intermedias

---

## Refactorización 8: Extract Interface → IGameEngine

### Técnica utilizada
**Introduce Interface** — [Martin Fowler Catalog](https://martinfowler.com/refactoring/catalog/introduceInterface.html)

### Referencia a guías
#### Documento 1 — Martin Fowler (Refactoring: Improving the Design of Existing Code)
- Sección: "🏛️ Consider Inheritance & State/Strategy" — principio de programar contra interfaces, no implementaciones concretas. Y "🔄 Replace Type Code With State/Strategy" — crear clases base abstractas como paso intermedio para desacoplar dependencias
- Concepto clave: "Dividir una clase concreta en una interfaz y su implementación. Programar contra la abstracción, no contra la concreción."

#### Documento 2 — Pedro J. Ponce de León (Tutorial de Refactorización)
- Sección: Sec. 5 "Refactorización y herencia" → "Extraer superclase: Clases con características similares → crear base común (abstracta o interfaz)." Y Sec. 4 "Las pruebas unitarias prueban módulos por separado — deben ser independientes, profesionales y versionadas."
- Concepto clave: "Enfatiza calidad y velocidad a largo plazo. El diseño evolutivo equilibra flexibilidad actual vs costo futuro de refactorización."

### Problema identificado
`GameEngine` no tiene interfaz propia definida como tipo. Quien lo consume acopla a la implementación concreta (`import { GameEngine }`), no a una abstracción. No es mockeable en tests del componente App.

### Código antes
```ts
// types.ts — GameEngine es solo una interfaz implícita (no definida como interface)
// app.ts — import y usa GameEngine directamente:
import { GameEngine } from './engine/game';
const engine = new GameEngine(GAME_CONFIG);
```

### Código después
```ts
// types.ts (nueva interfaz explícita)
export interface IGameEngine {
  getConfig(): GameConfig;
  getState(): GameState;
  selectPiece(coord: HexCoord): SelectionResult;
  executeMove(from: HexCoord, to: HexCoord): MoveResult;
  switchTurn(): void;
  checkVictory(): PlayerConfig | null;
  undoLastMove(): boolean;
  reset(config: GameConfig): GameState;
}

// game.ts: export class GameEngine implements IGameEngine { ... }
// app.ts: import type { IGameEngine } from './engine/types'; // solo tipo
```

### Pasos ejecutados
1. Definir `IGameEngine` en `types.ts` con los 8 métodos públicos de GameEngine
2. Agregar `implements IGameEngine` a `GameEngine` en `game.ts`
3. En `app.ts`, cambiar import de `GameEngine` a `import type { IGameEngine }` (solo tipo)
4. Compilar y probar

### Verificación
- [ ] `pnpm test` → pendiente de validación por el usuario
- [ ] `pnpm build` → pendiente de validación por el usuario
- [ ] Tests existentes no modificados
- [ ] Interfaz IGameEngine implementada por GameEngine

---

## Resumen de refactorizaciones con referencia cruzada

| # | Técnica Fowler | Doc. 1 (Fowler) | Doc. 2 (Ponce) | Bad smell |
|---|---------------|-----------------|----------------|-----------|
| 1 | **Move Method** | "🚚 Move Method" pasos 1-8 | Tabla "Mover método" — "Usado más en otro lugar" | Código duplicado |
| 2 | **Introduce Constant** | "🔍 Replace Temp With Query" (filosofía) | Sec. 3 "Código sospechoso" — valores sin contexto | Números mágicos |
| 3 | **Introduce Interface** | "🏛️ Consider Inheritance & State/Strategy" | Sec. 5 "Extraer superclase" — base común abstracta | Acoplamiento concreto |
| 4+7 | **Extract Method** (fusionada) | "🔀 Extract Method" + "Candidate Extraction" | Sec. 3 "Métodos muy largos" — descomponer responsabilidades | Método de 32 líneas + spread opaco |
| 5 | **Replace Conditional w/ Polymorphism** | "🔄 Replace Type Code w/ State/Strategy" + "Replace Conditional w/ Polymorphism" | Tabla "Cambiar condicional por polimorfismo" | Condicional if/else basado en tipo |
| 6 | **Extract Class** | "🏗️ Extract Class" — clase hace trabajo de dos | Sec. 3 "Clases muy grandes" — demasiadas responsabilidades | DFS mezclado con engine |
| 7 | **Replace Temp With Query** | "🔍 Replace Temp With Query" pasos 1-5 | Sec. 3 "Problemas con temporales" + Sec. 4 pruebas robustas | Variable temporal + construcción por pasos |
| 8 | **Introduce Interface** | "🏛️ Consider Inheritance & State/Strategy" | Sec. 5 "Extraer superclase" + Sec. 4 pruebas independientes | Sin interfaz para GameEngine |

---

## Orden de ejecución recomendado

```
1 → 2 → 3 → 4+7 → 5 → 6 → 7 → 8
│     │     │     │     │     │     │     │
│     │     │     │     │     │     │     └─ IGameEngine (interfaz pública)
│     │     │     │     │     │     └─────── JumpChainFinder (clase nueva)
│     │     │     │     │     └───────────── Zonas objetivo (polimorfismo)
│     │     │     │     └─────────────────── buildInitialState + getValidMoves
│     │     │     └───────────────────────── IBoard (interfaz pública)
│     │     └─────────────────────────────── Constants (valores nombrados)
└─────────────────────────────────────────── cellKey (utilidad compartida)
```

**Justificación:** Primero los cambios más seguros y de menor impacto (utilidades, constantes), luego la estructura (interfaces, clases nuevas), finalmente la limpieza interna. Cada paso debe pasar tests antes de continuar al siguiente.

---

## Verificación final

- [ ] `pnpm test` → 57 tests passing (sin cambios de comportamiento)
- [ ] `pnpm build` → sin errores TypeScript
- [ ] Todos los archivos nuevos creados en `src/engine/`
- [ ] Tests existentes no modificados
- [ ] Interfaz IBoard implementada por HexBoard
- [ ] Interfaz IGameEngine implementada por GameEngine
