# Fase B — Planificación del Proyecto XP

**Proyecto:** Damas Chinas (2 jugadores)  
**Metodología:** Extreme Programming (XP)  
**Duración total estimada:** ~6-8 horas (2 sesiones de 40 min en clase + trabajo independiente)  
**Fecha límite de entrega:** Lunes 25 de mayo, 14:00  

---

## Configuración del Equipo

| Elemento | Detalle |
|----------|---------|
| **Tamaño** | 4 personas |
| **Pareja A (Motor)** | Programador 1 + Programador 2 — Lógica (`src/engine/`) |
| **Pareja B (UI/UX)** | Programador 3 + Programador 4 — Componentes React, SVG (`src/components/`) |
| **Duración clase** | 2 sesiones de 40 minutos cada una |
| **Velocidad estimada por sesión** | ~8-10 puntos XP por pareja (conservador) |

---

## Contrato de Integración

```typescript
// src/engine/types.ts — Tipos compartidos (definidos en Iteración 0)

export type PlayerId = 1 | 2;

export interface PlayerConfig {
  id: PlayerId;
  color: string;       // valor HEX del color
  label: string;       // ej: 'Jugador 1'
  piecesInTarget: number;
  pointIndex: number;  // punta inicial (0=Sur, 1=Norte)
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

export type MoveType = 'step' | 'jump';

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

export interface ValidationResult { valid: boolean; reason?: string; }
export interface MoveResult { success: boolean; move?: Move; error?: string; }
export interface SelectionResult { success: boolean; validMoves?: HexCoord[]; }
```

---

## Mapa de Iteraciones

### Iteración 1 — "Tablero + Fichas Iniciales" (Clase 1, 40 min) ⭐

**Objetivo:** Ver el tablero con fichas estáticas. Primer entregable visual.

#### Pareja A — Motor

| Historia | Prioridad | Tareas | Estimación |
|----------|-----------|--------|------------|
| HU-1: Tablero renderizado | Alta | A1.1 Definir `HexBoard` con 121 casillas y `isValidPosition()`<br>A1.2 Implementar `getNeighbors()` para adyacencia<br>A1.3 Tests: validar posiciones y vecinos | 20 min |

#### Pareja B — UI/UX

| Historia | Prioridad | Tareas | Estimación |
|----------|-----------|--------|------------|
| HU-1: Tablero SVG | Alta | B1.1 Crear componente `<Board />` con `<svg>`<br>B1.2 Mapear coordenadas axiales → SVG pixel coords<br>B1.3 Crear componente `<HexCell />` con `polygon` | 20 min |
| HU-2: Fichas iniciales | Alta | B1.4 Crear componente `<Piece />` circular SVG<br>B1.5 Renderizar 20 fichas (10+10) en posiciones iniciales | 20 min |

#### Integración Iteración 1

| Actividad | Duración |
|-----------|----------|
| Unir `GameState` con `<Board />` — pasar estado por props | 5 min |
| Verificar que `npm run dev` muestra tablero + fichas | 5 min |

---

### Iteración 2 — "Juego Jugable" (Clase 2, 40 min) ⭐⭐ MVP

**Objetivo:** Seleccionar ficha → ver movimientos → mover → cambio de turno. Juego funcional mínimo.

#### Pareja A — Motor

| Historia | Prioridad | Tareas | Estimación |
|----------|-----------|--------|------------|
| HU-3: Selección de ficha | Alta | A2.1 Implementar `selectPiece()` con validación<br>A2.2 Implementar `getValidMoves()` (paso + salto) | 15 min |
| HU-4: Ejecutar movimiento | Alta | A2.3 Implementar `executeMove()` — mover ficha en estado<br>A2.4 Validar: turno correcto, destino vacío, adyacente/salto | 15 min |
| HU-5: Cambio de turno | Alta | A2.5 Implementar `switchTurn()` — rota entre jugadores | 5 min |
| HU-8: Indicador turno | Media | A2.6 Exponer `currentPlayer` en GameState | 5 min |

#### Pareja B — UI/UX

| Historia | Prioridad | Tareas | Estimación |
|----------|-----------|--------|------------|
| HU-3: Selección visual | Alta | B2.1 Implementar `handleCellClick()` en `<Board />`<br>B2.2 Highlight pieza seleccionada + casillas válidas (verde/naranja) | 15 min |
| HU-4: Click en destino | Alta | B2.3 Llamar `engine.executeMove()` al clickar casilla válida<br>B2.4 Limpiar selección tras movimiento | 10 min |
| HU-8: Indicador turno | Media | B2.5 Crear componente `<TurnIndicator />` con color del jugador activo | 10 min |

#### Integración Iteración 2

| Actividad | Duración |
|-----------|----------|
| Probar flujo completo: seleccionar → mover → turno cambia | 10 min |
| **Resultado: 🎮 PRIMER BUILD JUGABLE** | |

---

### Iteración 3 — "Saltos + Victoria" (Independiente)

**Objetivo:** Mecánicas completas de Damas Chinas. Saltos en cadena y detección de ganador.

#### Pareja A — Motor

| Historia | Tareas | Estimación |
|----------|--------|------------|
| HU-6: Saltos en cadena | A3.1 Implementar `findJumpChain()` con DFS<br>A3.3 Validar cadenas múltiples direcciones<br>A3.4 Tests Vitest: saltos simples, complejos, bloqueados | 1.5 horas |
| HU-7: Detección de victoria | A3.5 Implementar `checkVictory()` — verificar 10 fichas en zona objetivo<br>A3.6 Tests: victoria completa, parcial, sin victoria | 30 min |

#### Pareja B — UI/UX

| Historia | Tareas | Estimación |
|----------|--------|------------|
| HU-7: Pantalla victoria | B3.1 Crear componente `<VictoryModal />` con React Portal<br>B3.2 Mostrar ganador con color personalizado + botón reiniciar | 30 min |

---

### Iteración 4 — "Pulido" (Independiente)

**Objetivo:** Features que mejoran la experiencia. Reinicio y deshacer.

#### Pareja A — Motor

| Historia | Tareas | Estimación |
|----------|--------|------------|
| HU-9: Reiniciar juego | A4.1 Conectar `engine.reset()` con estado inicial<br>A4.2 Tests Vitest: reset completo, fichas en posición | 30 min |
| HU-10: Deshacer movimiento | A4.3 Implementar snapshot stack (`saveSnapshot()`, `restoreSnapshot()`)<br>A4.4 Implementar `undoLastMove()`<br>A4.5 Tests Vitest: deshacer, verificar estado restaurado | 1 hora |

#### Pareja B — UI/UX

| Historia | Tareas | Estimación |
|----------|--------|------------|
| HU-9: Botón reiniciar | B4.1 Crear componente `<GameControls />` con botón "Nuevo Juego"<br>B4.2 Conectar con `engine.reset()` | 20 min |
| HU-10: Botón deshacer | B4.3 Agregar botón "Deshacer" en `<GameControls />`<br>B4.4 Conectar con `engine.undoLastMove()` | 20 min |

---

## Resumen de Velocidad

| Iteración | Pareja A (Motor) | Pareja B (UI/UX) | Total | Resultado |
|-----------|------------------|-------------------|-------|-----------|
| **Iteración 1** (Clase 1) | HU-1, HU-2 = 5 pts | HU-1, HU-2 = 5 pts | **10 pts** | Tablero + fichas estáticas |
| **Iteración 2** (Clase 2) | HU-3,4,5 + HU-8 = 10 pts | HU-3,4 + HU-8 = 9 pts | **19 pts** | 🎮 Juego jugable |
| **Iteración 3** (Independiente) | HU-6,7 = 11 pts | HU-7 = 3 pts | **14 pts** | Saltos + victoria |
| **Iteración 4** (Independiente) | HU-9,10 = 5 pts | HU-9,10 = 4 pts | **9 pts** | Reiniciar + deshacer |
| **Total** | | | **52 pts** | **Juego completo** |

---

## Prácticas XP que se deben aplicar

| Práctica | Dónde se aplica | Cómo documentarlo |
|----------|-----------------|-------------------|
| **Planning Poker** | Inicio de cada iteración | Votos de cada miembro, resultado final |
| **Pair Programming** | Toda la codificación | Quién fue driver, quién navigator |
| **TDD** | Tests antes de código | Tests fallando → pasando (capturas) |
| **Simple Design** | Empezar mínimo, refinar después | Justificar decisiones simples |
| **Refactoring continuo** | Mejorar código sin cambiar behavior | Mostrar diffs de refactor |
| **Testing continuo** | Vitest en cada iteración | Tests pasando (capturas de `pnpm test`) |
| **Integración frecuente** | Final de cada sprint | Resultado de integración |
| **Demo** | Final de cada iteración | Capturas del juego funcionando |
| **Retrospectiva** | Final de cada iteración | Documento con aciertos y mejoras |

---

## Reglas de Trabajo Paralelo

1. **Contrato definido en Iteración 0** → Una vez acordado `types.ts`, cada pareja mockea datos propios
2. **Pareja B mockea datos del motor** → Desarrolla la UI con datos simulados hasta integración
3. **Integración al final de cada iteración** → 5-10 min uniendo trabajo y verificando
4. **Code reviews cruzadas** | Cada pareja revisa el trabajo de la otra al final de la iteración
5. **Commit frequency alta** → Ambos equipos commitan frecuentemente para minimizar conflictos
6. **El motor es prioridad** → Si hay conflicto, `src/engine/` tiene prioridad porque la UI depende de él
7. **MVP en Iteración 2** → Todo lo que no contribuya a un juego jugable se pospone

---

## Estrategia de Recorte (si el tiempo apremia)

| Nivel | Qué se recorta | Impacto |
|-------|----------------|---------|
| 🔴 **NO RECORTAR** | HU-3, HU-4, HU-5 (seleccionar, mover, turno) | Sin esto NO hay juego |
| 🟠 **Si urge:** | HU-6 (saltos en cadena) → posponer a Iteración 3 | El juego es jugable sin saltos |
| 🟡 **Si urge:** | HU-7 (victoria) → posponer | Se puede jugar sin detección de ganador |
| 🟢 **Siempre posponer:** | HU-9, HU-10 (reiniciar, deshacer) | Features nice-to-have |
