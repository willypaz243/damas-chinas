# Retrospectiva — Iteración 2

## 1. Información General

| Campo | Valor |
|-------|-------|
| **Iteración** | 2 |
| **Duración** | 40 minutos (Clase 2) |
| **Objetivo** | Juego funcional mínimo: seleccionar ficha, mover, cambio de turno |
| **Pareja A (Motor)** | Programador 1 + Programador 2 |
| **Pareja B (UI/UX)** | Programador 3 + Programador 4 |

---

## 2. Historias Trabajadas

| Historia | Nombre | Prioridad | Puntos XP | Estado |
|----------|--------|-----------|-----------|--------|
| HU-3 | Selección de ficha | Alta | 3 | ✅ Completada |
| HU-4 | Ejecutar movimiento | Alta | 3 | ✅ Completada |
| HU-5 | Cambio de turno | Alta | 2 | ✅ Completada |
| HU-8 | Indicador de turno | Media | 2 | ✅ Completada |

**Puntos XP planificados:** 10  
**Puntos XP logrados:** 10  
**Velocidad del equipo:** 10 pts / 40 min

### Planning Poker

| Miembro | HU-3 (voto) | HU-4 (voto) | HU-5 (voto) | HU-8 (voto) |
|---------|-------------|-------------|-------------|-------------|
| Programador 1 (Motor) | 3 | 3 | 2 | 2 |
| Programador 2 (Motor) | 3 | 3 | 2 | 1 |
| Programador 3 (UI/UX) | 3 | 3 | 2 | 2 |
| Programador 4 (UI/UX) | 2 | 3 | 2 | 2 |
| **Consenso final** | **3** | **3** | **2** | **2** |

---

## 3. Tareas Ejecutadas

### Pareja A — Motor (Driver: Programador 2, Navigator: Programador 1)

| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| A2.1 | Implementar `selectPiece()` con validación (turno, celda vacía, oponente) | ✅ | 8 min |
| A2.2 | Implementar `getValidMoves()` (paso adyacente + salto básico) | ✅ | 7 min |
| A2.3 | Implementar `executeMove()` — mover ficha, validar destino, historial | ✅ | 10 min |
| A2.4 | Validar: turno correcto, destino vacío, adyacente/salto | ✅ | (incluida en A2.3) |
| A2.5 | Implementar `switchTurn()` — rotar entre jugadores, limpiar selección | ✅ | 3 min |
| A2.6 | Exponer `currentPlayer` en `GameState` | ✅ | 1 min |

### Pareja B — UI/UX (Driver: Programador 4, Navigator: Programador 3)

| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| B2.1 | Implementar `handleCellClick()` en `<Board />` | ✅ | 8 min |
| B2.2 | Highlight pieza seleccionada (anillo dorado) + casillas válidas (puntos verdes) | ✅ | 7 min |
| B2.3 | Llamar `engine.executeMove()` al clickar casilla válida | ✅ | 5 min |
| B2.4 | Limpiar selección tras movimiento | ✅ | 3 min |
| B2.5 | Crear componente `<TurnIndicator />` con color del jugador activo | ✅ | 8 min |

### Integración

| Actividad | Estado | Tiempo real |
|-----------|--------|-------------|
| Probar flujo completo: seleccionar → mover → turno cambia | ✅ | 8 min |
| Verificar que `pnpm build` y `pnpm test` pasan | ✅ | 3 min |
| Corregir pre-commit hook (bun test → pnpm test:run) | ✅ | 2 min |

---

## 4. Código Generado

### Archivos creados/modificados por pareja

#### Pareja A — Motor

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/engine/game.ts` | Creado | Clase `GameEngine` con `selectPiece()`, `getValidMoves()`, `executeMove()`, `switchTurn()` |
| `src/engine/game.test.ts` | Creado | 20 tests unitarios para todas las funciones del motor |
| `src/engine/utils.ts` | Creado | Función `hexToPixel()` para conversión axial → píxel |

#### Pareja B — UI/UX

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/App.tsx` | Modificado | Hook `useEngine()` con estado y `handleCellClick`; integración de `TurnIndicator` |
| `src/components/Board/Board.tsx` | Modificado | Renderiza fichas desde `GameState`, anillo de selección, puntos de movimiento válido |
| `src/components/Board/HexCell.tsx` | Modificado | Refactorizado para usar `hexToPixel()` |
| `src/components/Piece/Piece.tsx` | Creado | Componente de ficha circular SVG con anillo dorado de selección |
| `src/components/TurnIndicator/TurnIndicator.tsx` | Creado | Indicador visual del jugador activo con color y etiqueta |
| `src/components/TurnIndicator/TurnIndicator.test.tsx` | Creado | 3 tests para el indicador de turno |

#### Configuración

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `.husky/pre-commit` | Modificado | Cambiado de `bun test` a `pnpm test:run` para compatibilidad con jsdom |

### Tests

```
✓ src/engine/board.test.ts (14 tests)
✓ src/engine/game.test.ts (20 tests)
  ✓ selectPiece (5 tests)
  ✓ getValidMoves (4 tests)
  ✓ executeMove (7 tests)
  ✓ switchTurn (2 tests)
  ✓ reset (2 tests)
✓ src/components/TurnIndicator/TurnIndicator.test.tsx (3 tests)
  ✓ debe mostrar el nombre del jugador actual
  ✓ debe mostrar "Turno de:" en el texto
  ✓ debe reflejar el cambio de jugador
```

---

## 5. Demostración

### Funcionalidades funcionando

- **Selección de ficha**: click en ficha propia → anillo dorado alrededor de la pieza
- **Movimientos válidos**: puntos verdes en casillas destino válidas (paso adyacente + salto básico)
- **Ejecutar movimiento**: click en punto verde → ficha se mueve a la nueva posición
- **Validaciones**: no se puede seleccionar celda vacía, ficha del oponente, ni mover a casilla ocupada
- **Cambio de turno**: tras mover, el turno pasa automáticamente al otro jugador
- **Indicador de turno**: barra con color del jugador activo y etiqueta "Turno de: Jugador X"
- **Historial**: cada movimiento se registra con origen, destino, tipo, jugador y timestamp

### Flujo completo jugable

```text
1. Jugador 1 (rojo) clickea ficha → anillo dorado + puntos verdes
2. Jugador 1 clickea destino válido → ficha se mueve
3. Indicador cambia a "Turno de: Jugador 2" (azul)
4. Jugador 2 clickea ficha → anillo dorado + puntos verdes
5. El juego es funcional y jugable entre 2 personas
```

### Problemas encontrados

- **Pointer-events**: Los círculos de `Piece` bloqueaban los clicks en los `polygon` subyacentes. Se corrigió con `pointerEvents="none"` en los círculos y puntos de movimiento.
- **Selección duplicada**: Al hacer click en una ficha ya seleccionada, se deseleccionaba y volvía a seleccionar. Se corrigió en `handleCellClick` detectando si el click es en un destino válido primero.
- **Pre-commit hook**: `bun test` no cargaba correctamente jsdom para tests de componentes React. Se cambió a `pnpm test:run`.
- **TypeScript y jest-dom**: `toBeInTheDocument` requiere tipos de `@testing-library/jest-dom/vitest`. Se agregó `/// <reference types` en el archivo de test.

---

## 6. Prácticas XP Aplicadas

| Práctica | ¿Se aplicó? | Comentario |
|----------|-------------|------------|
| Planning Poker | ✅ | Votación para HU-3 (3 pts), HU-4 (3 pts), HU-5 (2 pts), HU-8 (2 pts). Consenso rápido. |
| Pair Programming | ✅ | Pareja A: Programador 2 (driver) + Programador 1 (navigator). Pareja B: Programador 4 (driver) + Programador 3 (navigator). Roles intercambiados respecto a Iteración 1. |
| TDD | ✅ | Tests escritos para `selectPiece`, `getValidMoves`, `executeMove` y `switchTurn` antes de implementar. 20 tests en game.test.ts. |
| Simple Design | ✅ | Diseño mínimo: `GameEngine` con estado inmutable (spread operator + nuevo Map). Sin over-engineering. |
| Refactoring | ✅ | `hexToPixel()` extraída a `utils.ts`. `selectPiece()` actualizada para mantener selección interna. |
| Testing continuo | ✅ | `pnpm test:run` ejecutado tras cada cambio. 37 tests pasando (14 board + 20 game + 3 UI). |
| Integración frecuente | ✅ | App.tsx integra GameEngine vía hook `useEngine()`. Board recibe `GameState.board`, `selectedCell`, `validMoves` como props. |
| Demo | ✅ | Flujo completo demostrado: seleccionar → mover → turno cambia → indicador visual. 🎮 PRIMER BUILD JUGABLE. |
| Retrospectiva | ✅ | Este documento. |

---

## 7. Retrospectiva

### Qué salió bien

- El flujo completo de juego funciona: seleccionar ficha → ver destinos válidos → mover → cambio de turno
- TDD permitió implementar `executeMove` con todas las validaciones necesarias (turno, destino vacío, movimiento válido)
- El hook `useEngine()` mantiene el estado de UI (selección, movimientos) separado del estado del motor
- El indicador de turno (B2.5) se integró sin fricción gracias a que `currentPlayer` ya estaba en `GameState`
- La velocidad del equipo mejoró respecto a Iteración 1 (10 pts vs 5 pts en mismo tiempo)

### Qué mejorar

- El pre-commit hook con `bun test` causó problemas de entorno (jsdom) — ya corregido
- El archivo `vite.config.ts` todavía causa confusión con la importación de vitest/config — considerar mover la configuración de test completamente a `vitest.config.ts`
- `handleCellClick` tiene lógica condicional anidada que podría simplificarse en una próxima iteración
- Hace falta una validación visual de qué jugador puede mover (actualmente se permite clickear pero se rechaza silenciosamente)

### Acciones para la próxima iteración

1. Implementar saltos en cadena (DFS) en HU-6
2. Implementar detección de victoria en HU-7 con `VictoryModal`
3. Agregar feedback visual cuando se intenta mover ficha del oponente
4. Continuar con TDD para todas las nuevas funcionalidades
5. Mantener el intercambio de roles driver/navigator
