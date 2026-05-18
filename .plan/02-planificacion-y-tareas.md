# Fase B — Planificación y Tareas de Ingeniería (Planning)

> **Enfoque:** MVP jugable en Sprint 2. Priorizamos el loop principal del juego (tablero → selección → movimiento → turno) sobre pulido, animaciones y features secundarias. Todo lo demás se agrega iteración tras iteración.

---

## Stack Tecnológico

| Componente | Tecnología |
|------------|-----------|
| Framework | **React 18+** con **TypeScript** |
| Build tool | **Vite** |
| Testing | **Vitest** + **React Testing Library** |
| Hex grid rendering | **SVG** (react-renders SVG declarativo, más fácil de depurar que Canvas) |
| State management | **React useState/useReducer** (sin Redux/Zustand — overkill para este alcance) |
| Styling | **CSS modules** + variables CSS |
| Linting/formatting | **ESLint** + **Prettier** |
| Git hooks | **Husky** + **lint-staged** |

### Comandos iniciales del proyecto

```bash
# Crear proyecto con Vite (plantilla React + TypeScript)
npm create vite@latest damas-chinas -- --template react-ts
cd damas-chinas
npm install

# Testing
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Linting
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Husky + lint-staged (opcional, recomendado)
npm install -D husky lint-staged
npx husky init
```

### Estructura de directorios propuesta

```
damas-chinas/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Board/
│   │   │   ├── Board.tsx
│   │   │   ├── HexCell.tsx
│   │   │   └── HexCell.test.tsx
│   │   ├── Piece/
│   │   │   ├── Piece.tsx
│   │   │   └── Piece.test.tsx
│   │   ├── GameControls/
│   │   │   ├── GameControls.tsx
│   │   │   └── GameControls.test.tsx
│   │   ├── PlayerSetup/
│   │   │   ├── PlayerSetup.tsx
│   │   │   └── PlayerSetup.test.tsx
│   │   └── UI/
│   │       ├── TurnIndicator.tsx
│   │       ├── ScorePanel.tsx
│   │       └── VictoryModal.tsx
│   ├── engine/              # Lógica del juego (sin React)
│   │   ├── board.ts         # BoardState, HexBoard
│   │   ├── board.test.ts
│   │   ├── game.ts          # GameState, movimientos
│   │   ├── game.test.ts
│   │   ├── types.ts         # Tipos compartidos
│   │   └── utils.ts         # Coordenadas axiales, helpers
│   ├── hooks/               # Custom hooks
│   │   ├── useGameEngine.ts
│   │   └── useBoardDimensions.ts
│   ├── styles/
│   │   ├── globals.css      # Variables CSS, reset
│   │   └── Board.module.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
└── eslint.config.js
```

---

## Configuración del Equipo

| Elemento | Detalle |
|----------|---------|
| **Tamaño** | 4 personas |
| **Pareja A (Motor)** | Programador 1 + Programador 2 — Lógica de reglas, estado del juego, algoritmos (`src/engine/`) |
| **Pareja B (UI/UX)** | Programador 3 + Programador 4 — Componentes React, SVG rendering, interacción (`src/components/`) |
| **Duración iteración** | 1 semana (5 días hábiles) |
| **Velocidad estimada por pareja** | ~12 puntos XP por iteración (conservador para equipo aprendiendo XP + stack nuevo) |
| **Total de iteraciones** | **5 iteraciones** |

---

## Contrato de Integración

> **Se define en las primeras 45 min del Sprint 1 en pair programming cruzado** (un miembro de cada pareja). Es el único momento de integración temprana. Después, ambas parejas trabajan en paralelo usando sus propios mocks.

```typescript
// src/engine/types.ts — FICHERO COMPARTIDO (definido por ambas parejas)

// ── Tipos del dominio ────────────────────────────────────────

// Soporte para 2 a 6 jugadores mediante identificador numérico
export type PlayerId = 1 | 2 | 3 | 4 | 5 | 6;

// Mapeo de PlayerId a color visual asignado automáticamente
export interface PlayerConfig {
  id: PlayerId;
  color: string;            // valor HEX o nombre CSS (ej: '#E74C3C')
  label: string;            // ej: 'Jugador 1', 'P2'
  piecesInTarget: number;   // fichas en zona objetivo (0-10)
}

export type HexCoord {
  q: number;   // eje axial q
  r: number;   // eje axial r
}

export interface Cell {
  coord: HexCoord;
  pieceColor: string | null;     // color del jugador que ocupa la casilla (HEX)
  piecePlayerId: PlayerId | null; // ID del jugador al que pertenece la ficha
}

export type MoveType = 'step' | 'jump';

export interface Move {
  from: HexCoord;
  to: HexCoord;
  type: MoveType;
  player: PlayerConfig;
  turnNumber: number;
  timestamp: number;
  intermediatePositions?: HexCoord[];  // para cadenas de saltos
}

// ── Configuración del juego ──────────────────────────────────

export interface GameConfig {
  playerCount: 2 | 3 | 4 | 5 | 6;    // número de jugadores activos
  players: PlayerConfig[];              // jugadores incluidos en esta partida
  firstPlayerId: PlayerId;              // quién inicia
}

// ── Estado del juego (fuente de verdad) ──────────────────────

export interface GameState {
  board: Map<string, Cell>;            // "q,r" → Cell
  players: PlayerConfig[];             // lista de jugadores activos en esta partida
  playerCount: 2 | 3 | 4 | 5 | 6;    // número de jugadores
  currentPlayerIndex: number;          // índice en el array `players` del jugador actual
  currentPlayer: PlayerConfig;         // jugador cuyo turno es
  moveHistory: Move[];
  selectedPiece: HexCoord | null;
  validMoves: HexCoord[];              // casillas válidas para la pieza seleccionada
  winner: PlayerConfig | null;
  isGameOver: boolean;
}

// ── Interfaz que Pareja B consume de Pareja A (src/engine/game.ts) ──

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

// ── Interfaz que Pareja A consume de Pareja B (eventos del UI) ──

export interface BoardRenderer {
  render(state: GameState): void;          // re-render completo (React handles this)
  onCellClick(coord: HexCoord): void;      // callback → motor
  onPieceHover(coord: HexCoord): void;     // callback → highlight
}

// ── Result types ─────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  reason?: string;   // 'empty', 'occupied', 'not_adjacent', 'wrong_player', etc.
}

export interface MoveResult {
  success: boolean;
  move?: Move;
  error?: string;
  chainComplete?: boolean;   // true si se completó una cadena de saltos
}

export interface SelectionResult {
  success: boolean;
  validMoves?: HexCoord[];
  forcedJump?: boolean;      // true si hay saltos obligatorios
}

// ── Interfaz para selección de jugadores (PlayerSetup) ───────

export interface PlayerPoint {
  id: number;              // índice del triángulo (0-5, las 6 puntas de la estrella)
  label: string;           // ej: 'Norte', 'Noreste', etc.
  coord: HexCoord;         // coordenada central del triángulo de inicio
  occupiedBy?: PlayerId;   // ID del jugador asignado a esta punta
}

export type PlayerSetupState = {
  playerCount: 2 | 3 | 4 | 5 | 6;
  selectedPoints: number[];  // puntas seleccionadas (mínimo 2)
  players: PlayerConfig[];   // config generada para los jugadores
};
```

---

## Mapa de Iteraciones con Trabajo Paralelo

> **Principio rector:** Cada iteración entrega algo jugable. Sprint 2 debe tener un juego funcional mínimo (seleccionar ficha → mover → cambio de turno). Todo lo demás es mejora incremental.

---

### Iteración 1 — "Setup + Tablero Base" (Sprint 1)

**Objetivo:** Proyecto configurado con Vite/TS, motor inicial funcionando, tablero SVG renderizado con fichas estáticas. **El equipo ya puede ejecutar `npm run dev` y ver el tablero.**

#### Pareja A — Motor del Juego

| Historia | Prioridad | Esfuerzo | Notas MVP |
|----------|-----------|----------|-----------|
| HU-A1: Estado del tablero | **Alta** | 5 pts | Core absoluto. Tablero de 121 casillas en estrella de David. Sin esto no hay nada. |
| HU-A2: Posicionamiento inicial (multi-jugador) | **Alta** | 5 pts | Soporta 2-6 jugadores. Cada jugador ocupa un triángulo (10 fichas). Asignación dinámica de puntas. |
| HU-A10: Configuración del proyecto | **Alta** | 3 pts | Setup Vite+TS, estructura de carpetas, linting. **La hace la Pareja A porque el motor es la base.** |

**Total Pareja A:** 13 puntos

> **Nota:** La Pareja A lidera el setup del proyecto porque el motor (`src/engine/`) es la base que ambas parejas necesitan. La Pareja B se enfoca en el tablero SVG.

#### Pareja B — UI/UX

| Historia | Prioridad | Esfuerzo | Notas MVP |
|----------|-----------|----------|-----------|
| HU-B1: Renderizado del tablero (SVG) | **Alta** | 5 pts | Componente `<Board />` con casillas hexagonales SVG. Sin datos dinámicos aún. |
| HU-B2: Visualización de fichas (componente) | **Alta** | 3 pts | Componente `<Piece />` — ficha circular SVG con gradiente. Color dinámico por jugador. Se integra al final del sprint. |
| HU-B10: Pantalla de configuración de jugadores | **Alta** | 5 pts | Selector de cantidad (2-6) + selección visual de puntas en el tablero para cada jugador. Core de la experiencia de inicio. |

**Total Pareja B:** 13 puntos

#### Tareas de Ingeniería — Iteración 1

##### Pareja A — HU-A1: Estado del tablero (5 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A1.1 | Definir `types.ts` con `HexCoord`, `Cell`, `PlayerId`, `PlayerConfig` | Diseño | 20 min | — |
| A1.2 | Implementar `HexBoard` con inicialización de las 121 casillas y conexiones axiales | Desarrollo | 1.5 h | A1.1 |
| A1.3 | Implementar `HexBoard.getNeighbors(q, r)` — retorna casillas adyacentes válidas | Desarrollo | 1 h | A1.2 |
| A1.4 | Implementar `HexBoard.isValidPosition(q, r)` — verifica si coordenada está en estrella | Desarrollo | 30 min | A1.2 |
| A1.5 | Tests unitarios con Vitest: validar posiciones, vecinos, inválidos | Testing | 1 h | A1.2-A1.4 |

**TDD:** `test_valid_positions()`, `test_neighbors_center()`, `test_invalid_positions()`

##### Pareja A — HU-A2: Posicionamiento inicial multi-jugador (5 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A2.1 | Definir `PlayerPoint[]` — las 6 puntas de la estrella con coordenadas centrales | Diseño | 30 min | A1.2 |
| A2.2 | Implementar `HexBoard.getTriangleCells(pointIndex)` — retorna 10 casillas del triángulo | Desarrollo | 1 h | A2.1 |
| A2.3 | Implementar `HexBoard.getTargetZone(player)` — zona objetivo (triángulo opuesto) | Desarrollo | 30 min | A2.2 |
| A2.4 | Implementar `HexBoard.getInitialPositions(pointIndex)` — retorna array de 10 coordenadas | Desarrollo | 30 min | A2.2 |
| A2.5 | Implementar clase `GameState` con estado inicial configurable (nº jugadores, puntas asignadas) | Desarrollo | 1 h | A2.4 |
| A2.6 | Tests unitarios: verificar posiciones iniciales para 2, 4 y 6 jugadores | Testing | 1 h | A2.5 |

**TDD:** `test_initial_positions_2_players()`, `test_initial_positions_4_players()`, `test_target_zones_correct()`

##### Pareja A — HU-A10: Configuración del proyecto (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A10.1 | Crear proyecto Vite + React + TypeScript | Setup | 20 min | — |
| A10.2 | Configurar estructura de carpetas (`src/engine/`, `src/components/`, `src/hooks/`, `src/styles/`) | Setup | 15 min | A10.1 |
| A10.3 | Configurar Vitest con JSDOM + React Testing Library | Testing | 20 min | A10.1 |
| A10.4 | Configurar ESLint + Prettier con reglas TypeScript | DevOps | 15 min | A10.1 |
| A10.5 | Crear `App.tsx` base con `<Board />` placeholder y verificar que `npm run dev` funciona | Integración | 30 min | A10.2-A10.4 |

**Resultado:** `npm run dev` levanta el servidor en `localhost:5173`.

##### Pareja B — HU-B1: Renderizado del tablero SVG (5 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B1.1 | Crear componente `<Board />` con `<svg>` container | Frontend | 30 min | — |
| B1.2 | Implementar `HexCell` — dibuja casilla hexagonal SVG con `polygon` | Frontend | 1.5 h | B1.1 |
| B1.3 | Mapear coordenadas axiales (q,r) → posiciones SVG (pixel coordinates) | Frontend | 1.5 h | B1.2 |
| B1.4 | Responsive: recalcular posiciones al redimensionar ventana | Frontend | 1 h | B1.3 |
| B1.5 | CSS module: centrado del tablero, colores de casillas alternados | UI | 30 min | — |

**Prueba:** Verificar que las 121 casillas se renderizan correctamente en diferentes tamaños.

##### Pareja B — HU-B2: Componente Piece (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B2.1 | Crear componente `<Piece color="#HEX" />` con SVG circle + gradiente | Frontend | 1 h | — |
| B2.2 | Posicionar pieza en coordenada (q,r) → SVG transform | Frontend | 1 h | B1.3 |
| B2.3 | Color dinámico: cada jugador recibe un color distinto automáticamente | UI | 15 min | — |
| B2.4 | Test visual con React Testing Library: verificar que el componente renderiza | Testing | 30 min | B2.1-B2.3 |

**Prueba:** Verificar que las fichas aparecen en las puntas correctas del tablero (usando datos mock).

##### Pareja B — HU-B10: Pantalla de configuración de jugadores (5 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B10.1 | Crear componente `<PlayerSetup />` con selector de cantidad (2-6 jugadores) | Frontend | 30 min | — |
| B10.2 | Renderizar mini-tablero SVG con las 6 puntas destacadas y etiquetadas | Frontend | 1 h | B1.3 |
| B10.3 | Implementar lógica de selección: clic en punta → asigna al jugador actual (ciclo) | Frontend | 1 h | B10.2 |
| B10.4 | Validar: mínimo 2 puntas, máximo min(6, playerCount) puntas | Frontend | 30 min | B10.3 |
| B10.5 | Generar colores automáticamente para cada jugador (paleta de 6 colores distinguishables) | UI | 30 min | — |
| B10.6 | Botón "Jugar" → valida selección y pasa config al motor | Integración | 30 min | B10.4 |

**Prueba:** Seleccionar 2, 4 y 6 jugadores → verificar que las puntas se asignan correctamente y la config se genera sin errores.

#### 🔗 Integración al final de Iteración 1

| Actividad | Responsable | Duración |
|-----------|-------------|----------|
| Conectar `GameState` (A) con `<Board />` (B) — pasar estado via props | Ambas parejas | 1 hora |
| Verificar que el tablero se renderiza con fichas en posiciones correctas | Pareja B | 30 min |
| **Resultado:** Tablero visible con fichas estáticas ejecutándose con `npm run dev` | | |

---

### Iteración 2 — "Primer Juego Jugable" (Sprint 2) ⭐ MVP

**Objetivo:** **Juego funcional mínimo.** Seleccionar ficha → ver movimientos válidos → mover → cambio de turno. Sin animaciones, sin saltos complejos, sin pulido. Pero se puede jugar una partida básica.

> **Esta es la prioridad máxima.** Todo lo que no contribuya a esto se pospone al Sprint 3+.

#### Pareja A — Motor del Juego

| Historia | Prioridad | Esfuerzo | Notas MVP |
|----------|-----------|----------|-----------|
| HU-A3: Movimiento básico (paso adyacente) | **Alta** | 5 pts | **Core del juego.** Sin esto no se puede jugar. |
| HU-A5: Gestión de turnos (multi-jugador) | **Alta** | 3 pts | Alterna entre los jugadores activos según `playerCount`. Esencial para cualquier partida. |
| HU-A6: Validación completa de movimientos | **Alta** | 5 pts | Rechaza movimientos inválidos con razón específica. |

**Total Pareja A:** 13 puntos

#### Pareja B — UI/UX

| Historia | Prioridad | Esfuerzo | Notas MVP |
|----------|-----------|----------|-----------|
| HU-B3: Selección visual de ficha (interacción) | **Alta** | 5 pts | Click en pieza → highlight + muestra movimientos válidos. Core de la interacción. |
| HU-B4: Ejecutar movimiento al clickar destino | **Alta** | 3 pts | Click en casilla válida → mueve ficha. Sin animación (eso viene después). |
| HU-B6: Indicador de turno (multi-jugador) | **Media** | 3 pts | Muestra "Turno: Jugador X (color)" con el color del jugador activo. |

**Total Pareja B:** 11 puntos

#### Tareas de Ingeniería — Iteración 2

##### Pareja A — HU-A3: Movimiento básico (5 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A3.1 | Implementar `GameState.canStepMove(from, to)` — valida paso adyacente | Desarrollo | 1 h | A1.2 (HexBoard) |
| A3.2 | Implementar `GameState.executeStepMove(from, to)` — retorna nuevo estado | Desarrollo | 1.5 h | A3.1 |
| A3.3 | Validar: casilla destino vacía, adyacente, turno del jugador correcto | Desarrollo | 30 min | A3.1 |
| A3.4 | Tests unitarios Vitest: movimientos válidos e inválidos (20+ casos) | Testing | 1.5 h | A3.1-A3.3 |

**TDD:** `test_valid_step_move()`, `test_occupied_destination_rejected()`, `test_non_adjacent_rejected()`

##### Pareja A — HU-A5: Gestión de turnos multi-jugador (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A5.1 | Implementar `GameState.currentPlayerIndex` con getter/setter | Desarrollo | 15 min | A2.5 |
| A5.2 | Implementar `GameState.switchTurn()` — rota al siguiente jugador en `players[]` | Desarrollo | 30 min | A5.1 |
| A5.3 | Implementar `getNextPlayerId()` y `getPreviousPlayerId()` | Desarrollo | 15 min | A5.2 |
| A5.4 | Tests unitarios: rotación de turnos para 2, 4 y 6 jugadores | Testing | 30 min | A5.2-A5.3 |

**TDD:** `test_turn_starts_first_player()`, `test_turn_rotates_correctly_4_players()`, `test_turn_wraps_around()`

##### Pareja A — HU-A6: Validación completa (5 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A6.1 | Implementar `GameState.canMove(from, to): ValidationResult` | Desarrollo | 1 h | A3.1 |
| A6.2 | Validar: no mover fichas de otro jugador, destino ocupado, paso inválido | Desarrollo | 30 min | A6.1 |
| A6.3 | Implementar `GameState.selectPiece(coord): SelectionResult` — con validMoves | Desarrollo | 1 h | A6.1 |
| A6.4 | Tests unitarios Vitest: todos los casos de movimiento inválido (15+ casos) | Testing | 1.5 h | A6.1-A6.3 |

**TDD:** `test_validate_opponent_piece_rejected()`, `test_validate_occupied_cell_rejected()`

##### Pareja B — HU-B3: Selección visual de ficha (5 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B3.1 | Implementar `handleCellClick(coord)` en `<Board />` — convierte click SVG → coord axial | Frontend | 1 h | B1.3 |
| B3.2 | Llamar `engine.selectPiece(coord)` y guardar resultado en state | Frontend | 30 min | B3.1 |
| B3.3 | Highlight pieza seleccionada (borde amarillo/glow) via CSS module | UI | 30 min | B3.2 |
| B3.4 | Mostrar casillas válidas con highlight verde | UI | 1 h | B3.2 |
| B3.5 | Deseleccionar al clickar fuera o en ficha propia | Frontend | 30 min | B3.2 |

**Prueba:** Click en pieza → se resalta + muestra casillas válidas (verde).

##### Pareja B — HU-B4: Ejecutar movimiento al click (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B4.1 | En `<Board />`: si hay pieza seleccionada + click en casilla válida → `engine.executeMove()` | Frontend | 1 h | B3.2 |
| B4.2 | Actualizar estado React con nuevo `GameState` (re-render automático) | Frontend | 30 min | B4.1 |
| B4.3 | Limpiar selección tras movimiento exitoso | Frontend | 15 min | B4.1 |
| B4.4 | Feedback visual: flash rojo en casilla si movimiento es inválido | UI | 30 min | B4.1 |

**Prueba:** Seleccionar pieza → click en casilla válida → ficha se mueve, turno cambia.

##### Pareja B — HU-B6: Indicador de turno multi-jugador (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B6.1 | Crear componente `<TurnIndicator />` con color del jugador activo | Frontend | 30 min | — |
| B6.2 | Mostrar "Turno: Jugador X" con fondo del color del jugador | UI | 30 min | B6.1 |
| B6.3 | Conectar con `engine.getState().currentPlayer` | Integración | 15 min | B6.2 |

**Prueba:** Cambiar turno → indicador se actualiza con el color correcto.

#### 🔗 Integración al final de Iteración 2 ⭐

| Actividad | Responsable | Duración |
|-----------|-------------|----------|
| **JUGABILIDAD:** Verificar flujo completo: configurar jugadores → seleccionar → ver movimientos → mover → cambio de turno | Ambas parejas | 1 hora |
| Probar con datos reales (no mock): estado del motor → props → React | Pareja B | 30 min |
| **Resultado: 🎮 PRIMER BUILD JUGABLE** — Se puede jugar una partida básica paso a paso con 2+ jugadores | | |

---

### Iteración 3 — "Mecánicas Completas" (Sprint 3)

**Objetivo:** Saltos, cadenas de saltos, detección de victoria. El juego ya es jugable pero le faltan las reglas completas de Damas Chinas.

> **Sin saltos no es Damas Chinas.** Esta iteración es crítica para la identidad del juego.

#### Pareja A — Motor del Juego

| Historia | Prioridad | Esfuerzo | Notas MVP |
|----------|-----------|----------|-----------|
| HU-A4: Movimiento con salto (cadena) | **Alta** | 8 pts | DFS sobre grafo. Core de Damas Chinas. |
| HU-A7: Detección de victoria (individual) | **Alta** | 3 pts | Verifica si un jugador completó todas sus fichas en su zona objetivo. |
| HU-A11: Forzar saltos obligatorios | **Media** | 2 pts | Regla clásica: si hay salto disponible, debe tomarse. |

**Total Pareja A:** 13 puntos

#### Pareja B — UI/UX

| Historia | Prioridad | Esfuerzo | Notas MVP |
|----------|-----------|----------|-----------|
| HU-B5: Animación de movimientos | **Media** | 5 pts | CSS transition (no requestAnimationFrame — más simple). |
| HU-B6 extendido: Score panel (multi-jugador) | **Media** | 3 pts | Contador visual de progreso para TODOS los jugadores. |

**Total Pareja B:** 8 puntos

#### Tareas de Ingeniería — Iteración 3

##### Pareja A — HU-A4: Movimiento con salto (8 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A4.1 | Implementar `HexBoard.findJumpTargets(q, r)` — casillas alcanzables por salto | Desarrollo | 1.5 h | A1.2 |
| A4.2 | Implementar `GameState.canJump(from, to)` — valida salto individual | Desarrollo | 30 min | A4.1 |
| A4.3 | Implementar DFS para encontrar **todas** las cadenas de saltos posibles | Desarrollo | 2 h | A4.1-A4.2 |
| A4.4 | Implementar `GameState.executeJumpChain(chain)` — ejecuta cadena completa | Desarrollo | 1.5 h | A4.3 |
| A4.5 | Tests unitarios Vitest: cadenas simples (2 saltos), complejas (5+ saltos) | Testing | 2 h | A4.1-A4.4 |

**TDD:** `test_single_jump()`, `test_jump_chain_3_hops()`, `test_jump_chain_blocked()`

##### Pareja A — HU-A7: Detección de victoria individual (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A7.1 | Implementar `HexBoard.getTargetZone(player)` — zona objetivo del jugador (triángulo opuesto) | Desarrollo | 30 min | A1.2 |
| A7.2 | Implementar `GameState.checkVictory()` — todas las fichas del jugador en su zona objetivo | Desarrollo | 30 min | A7.1 |
| A7.3 | Tests unitarios Vitest: victoria completa, parcial, sin victoria (para 2 y 4 jugadores) | Testing | 30 min | A7.2 |

**TDD:** `test_victory_all_pieces_in_target()`, `test_no_victory_partial_progress()`

##### Pareja A — HU-A11: Forzar saltos obligatorios (2 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A11.1 | Implementar `GameState.hasAvailableJumps(player)` — busca saltos disponibles para el jugador | Desarrollo | 30 min | A4.3 |
| A11.2 | Modificar `selectPiece()` para filtrar validMoves solo a saltos si hay jumps disponibles | Desarrollo | 30 min | A11.1 |
| A11.3 | Tests unitarios: verificación de salto obligatorio | Testing | 30 min | A11.1-A11.2 |

##### Pareja B — HU-B5: Animación de movimientos (5 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B5.1 | CSS transition en `<Piece />`: `transition: transform 0.3s ease` | UI | 15 min | — |
| B5.2 | Hook `useAnimation` que anima `transform: translate()` de coord origen a destino | Frontend | 1.5 h | B5.1 |
| B5.3 | Animar cadenas de saltos secuencialmente (delay entre cada salto) | Frontend | 1.5 h | B5.2 |
| B5.4 | Configurar toggle "desactivar animaciones" (accesibilidad) | UI | 30 min | B5.2 |
| B5.5 | Test visual: verificar fluidez en diferentes tamaños de tablero | Testing | 30 min | B5.1-B5.3 |

##### Pareja B — Score panel multi-jugador (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B6.1 | Crear componente `<ScorePanel />` con contadores de fichas en zona objetivo para TODOS los jugadores | Frontend | 1 h | — |
| B6.2 | Conectar con `engine.getProgress(player)` para cada jugador activo | Integración | 30 min | A7.3 |
| B6.3 | Estilo visual: barras de progreso por jugador + indicador del turno actual resaltado | UI | 30 min | B6.1 |

#### 🔗 Integración al final de Iteración 3

| Actividad | Responsable | Duración |
|-----------|-------------|----------|
| Conectar animaciones (B5) con `executeMove()` del motor (A3/A4) | Ambas parejas | 30 min |
| Conectar score panel (B6) con `getProgress()` del motor (A7) | Ambas parejas | 30 min |
| **Verificar:** saltos → cadenas → victoria con animaciones | Pareja B | 1 hora |
| **Resultado:** Juego completo con reglas de Damas Chinas implementadas | | |

---

### Iteración 4 — "Features Completas" (Sprint 4)

**Objetivo:** Historial, deshacer, pantalla de victoria, diseño visual. Features que mejoran la experiencia pero no bloquean jugabilidad.

#### Pareja A — Motor del Juego

| Historia | Prioridad | Esfuerzo | Notas MVP |
|----------|-----------|----------|-----------|
| HU-A8: Historial de movimientos | **Media** | 3 pts | Registro inmutable con Vitest. Incluye info del jugador en cada movimiento. |
| HU-A9: Deshacer último movimiento | **Media** | 3 pts | Snapshot-based undo. Restaura estado completo del tablero y turnos. |

**Total Pareja A:** 6 puntos

#### Pareja B — UI/UX

| Historia | Prioridad | Esfuerzo | Notas MVP |
|----------|-----------|----------|-----------|
| HU-B7: Pantalla de victoria (modal) | **Media** | 3 pts | Overlay con React Portal. Muestra al ganador con color personalizado. |
| HU-B8: Historial visual (panel lateral) | **Baja** | 3 pts | Lista de movimientos con colores de jugador. |
| HU-B9: Diseño visual general y responsive | **Baja** | 5 pts | Paleta, tipografía, layouts. Soporte para 6 jugadores en UI. |

**Total Pareja B:** 11 puntos

#### Tareas de Ingeniería — Iteración 4

##### Pareja A — HU-A8: Historial (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A8.1 | Implementar `MoveHistory` con array inmutable de movimientos | Desarrollo | 30 min | — |
| A8.2 | Implementar `GameState.recordMove(move)` | Desarrollo | 15 min | A8.1 |
| A8.3 | Tests Vitest: agregar, obtener historial, orden cronológico | Testing | 30 min | A8.1-A8.2 |

##### Pareja A — HU-A9: Deshacer (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| A9.1 | Implementar snapshot stack (`saveSnapshot()`, `restoreSnapshot()`) | Desarrollo | 1.5 h | A2.5 |
| A9.2 | Implementar `GameState.undoLastMove()` — restaura snapshot anterior | Desarrollo | 30 min | A9.1 |
| A9.3 | Tests Vitest: deshacer, verificar estado restaurado | Testing | 30 min | A9.1-A9.2 |

##### Pareja B — HU-B7: Pantalla de victoria (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B7.1 | Crear componente `<VictoryModal />` con React Portal | Frontend | 30 min | — |
| B7.2 | Implementar `showVictory(winner)` — fade-in + slide-up (CSS) | UI | 1 h | B7.1 |
| B7.3 | Texto de victoria + botón "Jugar de Nuevo" → `engine.reset()` | Frontend | 30 min | B7.2 |

##### Pareja B — HU-B8: Historial visual (3 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B8.1 | Crear componente `<MoveHistoryPanel />` con lista scrollable | Frontend | 30 min | — |
| B8.2 | Formatear: "Turno N: Jugador X (color) — casilla A → casilla B [paso/cadena]" | Frontend | 1 h | B8.1 |
| B8.3 | Scroll automático al último movimiento + resaltar último | UI | 30 min | B8.2 |

##### Pareja B — HU-B9: Diseño visual general (5 pts)

| # | Tarea | Tipo | Estimación | Dependencia |
|---|-------|------|------------|-------------|
| B9.1 | Definir paleta de colores completa (6+ colores distinguishables) y tipografía en CSS variables | Diseño | 30 min | — |
| B9.2 | Efectos hover en casillas (cambio de color/sombra) | UI | 1 h | B1.2 |
| B9.3 | Responsive: layout adaptativo para tablet y escritorio | Frontend | 1.5 h | B9.1 |
| B9.4 | Test visual: renderizado en Chrome, Firefox, Safari | Testing | 1 h | B9.1-B9.3 |

#### 🔗 Integración al final de Iteración 4

| Actividad | Responsable | Duración |
|-----------|-------------|----------|
| Conectar historial (B8) con `getHistory()` del motor (A8) | Ambas parejas | 30 min |
| Conectar deshacer (botón) con `undoLastMove()` del motor (A9) | Ambas parejas | 30 min |
| Conectar victoria (B7) con `checkVictory()` del motor (A7) | Ambas parejas | 30 min |
| Prueba integral completa del juego con 2, 4 y 6 jugadores | Pareja B | 1.5 horas |
| **Resultado:** Juego completo con todas las funcionalidades | | |

---

### Iteración 5 — "Demo y Presentación" (Sprint 5)

**Objetivo:** Pulido final, pruebas, documentación y preparación de la demo.

| Actividad | Responsable | Estimación |
|-----------|-------------|------------|
| Pruebas Vitest: cubrir edge cases no cubiertos (multi-jugador) | Pareja A | 1.5 horas |
| Pulido visual final (colores, sombras, transiciones) | Pareja B | 2 horas |
| Build de producción: `npm run build` + verificar output | Ambas parejas | 30 min |
| Documentación técnica y README | Ambas parejas | 1.5 horas |
| Preparación de demo y ensayo | Ambas parejas | 1 hora |
| Retrospectiva del proceso XP | Ambas parejas | 1 hora |

**Total:** ~7 horas de trabajo conjunto

---

## Resumen de Velocidad por Iteración

| Iteración | Pareja A (Motor) | Pareja B (UI/UX) | Total | Resultado Esperado |
|-----------|------------------|-------------------|-------|-------------------|
| **Sprint 1** | HU-A1(5) + HU-A2(5) + HU-A10(3) = **13 pts** | HU-B1(5) + HU-B2(3) + HU-B10(5) = **13 pts** | **26 pts** | Tablero SVG + fichas estáticas + configuración de jugadores + `npm run dev` |
| **Sprint 2** ⭐ | HU-A3(5) + HU-A5(3) + HU-A6(5) = **13 pts** | HU-B3(5) + HU-B4(3) + HU-B6(3) = **11 pts** | **24 pts** | 🎮 **PRIMER BUILD JUGABLE** (multi-jugador) |
| **Sprint 3** | HU-A4(8) + HU-A7(3) + HU-A11(2) = **13 pts** | HU-B5(5) + HU-B6-ext(3) = **8 pts** | **21 pts** | Saltos + cadenas + victoria + animaciones |
| **Sprint 4** | HU-A8(3) + HU-A9(3) = **6 pts** | HU-B7(3) + HU-B8(3) + HU-B9(5) = **11 pts** | **17 pts** | Historial + undo + modal + diseño completo |
| **Sprint 5** | Pruebas + docs = **4 pts** | Pulido + build + demo = **4 pts** | **8 pts** | Producto final listo para entrega |
| **Total** | | | **96 pts** | **Damas Chinas (2-6 jugadores) completo** |

---

## Priorización MVP — Qué se puede recortar si el tiempo apremia

Si el Sprint 2 no avanza como esperado, estas son las **estrategias de recorte en orden de prioridad**:

| Nivel | Qué se recorta | Impacto |
|-------|----------------|---------|
| 🔴 **NO RECORTAR** | Movimiento básico + cambio de turno (multi-jugador) | Sin esto NO hay juego |
| 🟠 **Si urge:** | Saltos complejos (Sprint 3) → mover a Sprint 4 | El juego es jugable sin saltos, aunque no es Damas Chinas completa |
| 🟡 **Si urge:** | Animaciones (Sprint 3 HU-B5) | Se puede jugar sin animaciones |
| 🟢 **Siempre posponer:** | Historial (Sprint 4), Undo (Sprint 4), Diseño visual pulido (Sprint 4) | Features nice-to-have |

---

## Mapa de Paralelismo por Iteración

```
ITERACIÓN 1 ──────────────────────────────────────────────
┌─────────────────────────┐    ┌─────────────────────────┐
│   Pareja A (Motor)      │    │   Pareja B (UI/UX)      │
│                         │    │                         │
│  HU-A1: Estado tablero  │    │  HU-B1: Tablero SVG     │
│  HU-A2: Fichas iniciales│    │  HU-B2: Componente      │
│       (multi-jugador)   │    │       Piece             │
│  HU-A10: Setup Vite+TS  │    │  HU-B10: Config.        │
│                         │    │       jugadores         │
│  Algoritmo puro         │    │                         │
│  sin dependencias UI    │    │  SVG declarativo        │
│                         │    │  sin dependencias motor │
└───────────┬─────────────┘    └──────────┬──────────────┘
            │ INTEGRACIÓN (1h)             │
            └──────────────────────────────┘
            Tablero SVG + fichas estáticas + config de jugadores

ITERACIÓN 2 ⭐ MVP ───────────────────────────────────────
┌─────────────────────────┐    ┌─────────────────────────┐
│   Pareja A (Motor)      │    │   Pareja B (UI/UX)      │
│                         │    │                         │
│  HU-A3: Movimiento      │    │  HU-B3: Selección +     │
│       básico            │    │       highlight         │
│  HU-A6: Validación      │    │  HU-B4: Ejecutar        │
│  HU-A5: Turnos (multi)  │    │       movimiento        │
│                         │    │  HU-B6: Indicador turno │
│  Lógica + reglas        │    │       (multi-jugador)   │
│  sin dependencias UI    │    │                         │
│                         │    │  Interacción click →    │
│                         │    │  engine.selectPiece()   │
└───────────┬─────────────┘    └──────────┬──────────────┘
            │ INTEGRACIÓN (1.5h)           │
            └──────────────────────────────┘
            🎮 PRIMER BUILD JUGABLE (multi-jugador)

ITERACIÓN 3 ──────────────────────────────────────────────
┌─────────────────────────┐    ┌─────────────────────────┐
│   Pareja A (Motor)      │    │   Pareja B (UI/UX)      │
│                         │    │                         │
│  HU-A4: Saltos/cadenas  │    │  HU-B5: Animaciones     │
│  HU-A7: Detección       │    │  HU-B6-ext: Score panel │
│       victoria (indiv.) │    │       (multi-jugador)   │
│  HU-A11: Saltos         │    │                         │
│       obligatorios      │    │  CSS transitions        │
│                         │    │  Contador de progreso   │
│  Algoritmo DFS puro     │    │  para todos los         │
│  sin dependencias UI    │    │  jugadores activos      │
└───────────┬─────────────┘    └──────────┬──────────────┘
            │ INTEGRACIÓN (1.5h)           │
            └──────────────────────────────┘
            Saltos + victoria + animaciones

ITERACIÓN 4 ──────────────────────────────────────────────
┌─────────────────────────┐    ┌─────────────────────────┐
│   Pareja A (Motor)      │    │   Pareja B (UI/UX)      │
│                         │    │                         │
│  HU-A8: Historial       │    │  HU-B7: Victory modal   │
│  HU-A9: Deshacer        │    │  HU-B8: Move history    │
│                         │    │       panel             │
│  Stack/snapshot puro    │    │  HU-B9: Diseño visual   │
│  sin dependencias UI    │    │       general (6+ cols) │
└───────────┬─────────────┘    └──────────┬──────────────┘
            │ INTEGRACIÓN (1.5h)           │
            └──────────────────────────────┘
            Juego COMPLETO funcional

ITERACIÓN 5 ──────────────────────────────────────────────
┌─────────────────────────────────────────────────────────┐
│              AMBAS PAREJAS JUNTAS                       │
│                                                         │
│   Pruebas | Pulido | Build | Docs | Demo | Retro       │
└─────────────────────────────────────────────────────────┘
```

---

## Reglas de Trabajo Paralelo

1. **Contrato definido en Sprint 1** → Una vez acordado `types.ts`, cada pareja usa sus propios mocks para desarrollar
2. **Pareja B mockea datos del motor** → Desarrolla la UI con datos simulados hasta la integración al final de cada sprint
3. **Integración al final de cada sprint** → 1-2 horas donde ambas parejas unen su trabajo y verifican que todo funciona
4. **Code reviews cruzadas** → Cada pareja revisa el trabajo de la otra al final del sprint (XP standard)
5. **Commit frequency alta** → Ambos equipos commitan frecuentemente para minimizar conflictos de merge
6. **El motor es la prioridad** → Si hay conflicto de recursos, el motor (`src/engine/`) tiene prioridad porque la UI depende de él
7. **MVP en Sprint 2** → Todo lo que no contribuya a un juego jugable en Sprint 2 se pospone

---

## Integración con React — Consideraciones Técnicas

### Estado del juego en React

```typescript
// src/hooks/useGameEngine.ts — Hook principal que conecta motor con UI

import { useState, useCallback } from 'react';
import { GameEngine, GameState, GameConfig } from '../engine/game';

export function useGameEngine(engine: GameEngine) {
  const [state, setState] = useState<GameState>(engine.getState());

  const selectPiece = useCallback((coord: HexCoord) => {
    const result = engine.selectPiece(coord);
    if (result.success) {
      setState(engine.getState());
    }
    return result;
  }, [engine]);

  const executeMove = useCallback((from: HexCoord, to: HexCoord) => {
    const result = engine.executeMove(from, to);
    if (result.success) {
      setState(engine.getState());
    }
    return result;
  }, [engine]);

  const undoLastMove = useCallback(() => {
    const success = engine.undoLastMove();
    if (success) setState(engine.getState());
    return success;
  }, [engine]);

  const reset = useCallback((config: GameConfig) => {
    setState(engine.reset(config));
  }, [engine]);

  return { state, selectPiece, executeMove, undoLastMove, reset };
}
```

### Pantalla de configuración de jugadores

```typescript
// src/components/PlayerSetup/PlayerSetup.tsx — Selección de jugadores

import { useState } from 'react';
import { PlayerPoint, GameConfig } from '../../engine/types';

const PLAYER_COLORS = [
  '#E74C3C', // rojo
  '#3498DB', // azul
  '#2ECC71', // verde
  '#F39C12', // naranja
  '#9B59B6', // morado
  '#1ABC9C', // turquesa
];

interface PlayerSetupProps {
  onStart: (config: GameConfig) => void;
}

export default function PlayerSetup({ onStart }: PlayerSetupProps) {
  const [playerCount, setPlayerCount] = useState<2 | 3 | 4 | 5 | 6>(2);
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);

  const handlePointClick = (pointIndex: number) => {
    if (selectedPoints.includes(pointIndex)) {
      setSelectedPoints(selectedPoints.filter(p => p !== pointIndex));
    } else if (selectedPoints.length < playerCount) {
      setSelectedPoints([...selectedPoints, pointIndex]);
    }
  };

  const handleStart = () => {
    if (selectedPoints.length < 2) return; // mínimo 2 jugadores

    const config: GameConfig = {
      playerCount,
      players: selectedPoints.map((pointIndex, i) => ({
        id: (i + 1) as PlayerId,
        color: PLAYER_COLORS[i],
        label: `Jugador ${i + 1}`,
        piecesInTarget: 0,
      })),
      firstPlayerId: 1,
    };

    onStart(config);
  };

  // ... renderiza mini-tablero con puntas seleccionables + selector de cantidad
}
```

### Renderizado del tablero SVG en React

```typescript
// src/components/Board/Board.tsx — Componente principal del tablero

import { HexCoord, GameState } from '../../../engine/types';
import { hexToPixel, pixelToHex } from '../../../engine/utils';
import HexCell from './HexCell';
import Piece from '../Piece/Piece';

interface BoardProps {
  state: GameState;
  onCellClick: (coord: HexCoord) => void;
  onCellHover: (coord: HexCoord | null) => void;
  size: number;  // tamaño en píxeles del tablero
}

export default function Board({ state, onCellClick, onCellHover, size }: BoardProps) {
  const center = size / 2;
  const cellRadius = size / 30;  // ajuste proporcional

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const coord = pixelToHex(x, y, size);
        onCellClick(coord);
      }}
      onMouseLeave={() => onCellHover(null)}
    >
      {/* Casillas */}
      {Array.from(state.board.values()).map((cell) => {
        const [cx, cy] = hexToPixel(cell.coord, cellRadius, center);
        const isSelected = state.selectedPiece?.q === cell.coord.q &&
                          state.selectedPiece?.r === cell.coord.r;
        const isValidMove = state.validMoves.some(
          m => m.q === cell.coord.q && m.r === cell.coord.r
        );

        return (
          <HexCell
            key={`${cell.coord.q},${cell.coord.r}`}
            cx={cx}
            cy={cy}
            r={cellRadius}
            color={cell.pieceColor}
            isSelected={isSelected}
            isValidMove={isValidMove}
            onMouseEnter={() => onCellHover(cell.coord)}
          />
        );
      })}

      {/* Fichas */}
      {Array.from(state.board.values())
        .filter(cell => cell.pieceColor !== null)
        .map((cell) => {
          const [cx, cy] = hexToPixel(cell.coord, cellRadius, center);
          return (
            <Piece
              key={`piece-${cell.coord.q},${cell.coord.r}`}
              cx={cx}
              cy={cy}
              r={cellRadius * 0.75}
              color={cell.pieceColor!}
            />
          );
        })}
    </svg>
  );
}
```

### Score Panel multi-jugador

```typescript
// src/components/UI/ScorePanel.tsx — Progreso de todos los jugadores

import { GameState } from '../../engine/types';

interface ScorePanelProps {
  state: GameState;
  currentPlayerIndex: number;  // índice del jugador activo
}

export default function ScorePanel({ state, currentPlayerIndex }: ScorePanelProps) {
  return (
    <div className="score-panel">
      {state.players.map((player, index) => {
        const isActive = index === currentPlayerIndex;
        const progress = (player.piecesInTarget / 10) * 100;

        return (
          <div
            key={player.id}
            className={`score-item ${isActive ? 'active' : ''}`}
            style={{ borderLeft: `4px solid ${player.color}` }}
          >
            <span className="player-label" style={{ color: player.color }}>
              {player.label}
            </span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`,
                  backgroundColor: player.color,
                }}
              />
            </div>
            <span className="piece-count">{player.piecesInTarget}/10</span>
          </div>
        );
      })}
    </div>
  );
}
```

### Testing con Vitest + React Testing Library

```typescript
// src/components/Board/Board.test.tsx

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Board from './Board';
import { GameState, HexCoord, GameConfig } from '../../../engine/types';

function createMockState(overrides: Partial<GameState> = {}): GameState {
  const baseConfig: GameConfig = {
    playerCount: 4,
    players: [
      { id: 1, color: '#E74C3C', label: 'Jugador 1', piecesInTarget: 0 },
      { id: 2, color: '#3498DB', label: 'Jugador 2', piecesInTarget: 0 },
      { id: 3, color: '#2ECC71', label: 'Jugador 3', piecesInTarget: 0 },
      { id: 4, color: '#F39C12', label: 'Jugador 4', piecesInTarget: 0 },
    ],
    firstPlayerId: 1,
  };

  return {
    board: new Map(),
    players: baseConfig.players,
    playerCount: baseConfig.playerCount,
    currentPlayerIndex: 0,
    currentPlayer: baseConfig.players[0],
    moveHistory: [],
    selectedPiece: null,
    validMoves: [],
    winner: null,
    isGameOver: false,
    ...overrides,
  };
}

describe('Board', () => {
  it('renders all 121 cells', () => {
    const state = createMockState();
    const { container } = render(
      <Board
        state={state}
        onCellClick={() => {}}
        onCellHover={() => {}}
        size={600}
      />
    );
    const cells = container.querySelectorAll('polygon');
    expect(cells.length).toBeGreaterThan(100);
  });

  it('calls onCellClick with correct coordinate when cell is clicked', () => {
    const state = createMockState();
    const onClick = vi.fn();
    const { container } = render(
      <Board
        state={state}
        onCellClick={onClick}
        onCellHover={() => {}}
        size={600}
      />
    );
    const firstCell = container.querySelector('polygon');
    if (firstCell) {
      fireEvent.click(firstCell);
      expect(onClick).toHaveBeenCalled();
    }
  });

  it('highlights valid moves when piece is selected', () => {
    const mockMoves: HexCoord[] = [
      { q: 1, r: 0 },
      { q: 0, r: 1 },
    ];
    const state = createMockState({
      selectedPiece: { q: 0, r: 0 },
      validMoves: mockMoves,
    });
    const { container } = render(
      <Board
        state={state}
        onCellClick={() => {}}
        onCellHover={() => {}}
        size={600}
      />
    );
    // Valid move cells should have a specific class/style
    expect(container.querySelector('.valid-move')).toBeTruthy();
  });
});

// ── Tests multi-jugador ─────────────────────────────────────

describe('Board — Multi-jugador', () => {
  it('renders pieces with correct colors for all players', () => {
    const state = createMockState({
      players: [
        { id: 1, color: '#E74C3C', label: 'Jugador 1', piecesInTarget: 0 },
        { id: 2, color: '#3498DB', label: 'Jugador 2', piecesInTarget: 0 },
      ],
    });
    const { container } = render(
      <Board
        state={state}
        onCellClick={() => {}}
        onCellHover={() => {}}
        size={600}
      />
    );
    // Verificar que las fichas rojas y azules se renderizan
    const pieces = container.querySelectorAll('circle.piece');
    expect(pieces.length).toBeGreaterThan(0);
  });

  it('switches turn to next player in list', () => {
    const state = createMockState({
      players: [
        { id: 1, color: '#E74C3C', label: 'Jugador 1', piecesInTarget: 0 },
        { id: 2, color: '#3498DB', label: 'Jugador 2', piecesInTarget: 0 },
        { id: 3, color: '#2ECC71', label: 'Jugador 3', piecesInTarget: 0 },
      ],
      currentPlayerIndex: 0,
    });
    // El turno debe rotar de Jugador 1 → Jugador 2 → Jugador 3 → Jugador 1...
    expect(state.currentPlayerIndex).toBe(0);
  });
});
```

---

## Flujo de Trabajo Diario Recomendado (XP + React)

### Cada mañana (15 min — Planning Poker + Standup)

1. **Planning poker:** La pareja estiman las historias del sprint
2. **Standup:** ¿Qué hice ayer? ¿Qué haré hoy? ¿Hay bloqueos?

### Durante el día

| Momento | Actividad |
|---------|-----------|
| **Mañana** | Pair programming en la historia de mayor prioridad |
| **Mediodía** | Commit + push. Verificar que `npm test` pasa |
| **Tarde** | Continuar pair programming. Si hay bloqueo, hacer spike (experimento rápido) |
| **Final del día** | Commit + push. Documentar decisiones de diseño en comentarios del código |

### Al final de cada sprint

| Actividad | Duración | Responsable |
|-----------|----------|-------------|
| Integración (unir motor + UI) | 1-2 horas | Ambas parejas |
| Code review cruzado | 30 min | Ambas parejas |
| Demo del build | 15 min | Pareja B presenta, Pareja A valida motor |
| Retro breve | 15 min | Ambas parejas — ¿qué salió bien? ¿qué mejorar? |

---

## Criterios de "Listo" (Definition of Done)

Una historia se considera **Done** cuando cumple TODO lo siguiente:

- [ ] Código implementado en TypeScript con tipos correctos
- [ ] Tests unitarios escritos y pasando con Vitest
- [ ] Integrada con la otra pareja (UI o motor funciona junta)
- [ ] Code review cruzado completado
- [ ] Funciona en `npm run dev` sin errores
- [ ] Documentación inline (comentarios JSDoc en funciones públicas)

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Curva de aprendizaje React/TypeScript | Alta | Media | Sprint 1 dedica tiempo al setup + pair programming para compartir conocimiento |
| Problemas de merge entre parejas | Media | Media | Commits frecuentes, branch por historia, integración diaria mínima |
| Saltos complejos toman más tiempo del estimado | Media | Alta | Si no avanza en Sprint 3, saltos simples se posponen a Sprint 4 |
| Renderizado SVG lento con 121 casillas | Baja | Media | Usar `React.memo` en componentes de celda; lazy render si es necesario |
| Animaciones bloquean la UX | Baja | Baja | Toggle para desactivar animaciones (ya incluido en HU-B5) |
| Diferenciar colores para 6 jugadores | Media | Media | Paleta predefinida de 6 colores distinguishables (ver `PLAYER_COLORS`); test visual de contraste |
| UI saturada con 6 jugadores | Baja | Baja | Score panel colapsable; tooltip al hover sobre cada jugador; diseño responsive |
