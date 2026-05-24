# Retrospectiva — Iteración 4

## 1. Información General

| Campo | Valor |
|-------|-------|
| **Iteración** | 4 |
| **Duración** | Trabajo independiente (1–1.5 horas) |
| **Objetivo** | Reiniciar juego y deshacer movimientos |
| **Pareja A (Motor)** | Programador 1 + Programador 2 |
| **Pareja B (UI/UX)** | Programador 3 + Programador 4 |

---

## 2. Historias Trabajadas

| Historia | Nombre | Prioridad | Puntos XP | Estado |
|----------|--------|-----------|-----------|--------|
| HU-9 | Reiniciar juego | Media | 2 | ✅ Completada |
| HU-10 | Deshacer movimiento | Media | 3 | ✅ Completada |

**Puntos XP planificados:** 5  
**Puntos XP logrados:** 5  
**Velocidad del equipo:** ~3.5 pts / hora

### Planning Poker

| Miembro | HU-9 (voto) | HU-10 (voto) |
|---------|-------------|--------------|
| Programador 1 (Motor) | 2 | 3 |
| Programador 2 (Motor) | 2 | 3 |
| Programador 3 (UI/UX) | 2 | 3 |
| Programador 4 (UI/UX) | 2 | 2 |
| **Consenso final** | **2** | **3** |

---

## 3. Tareas Ejecutadas

### Pareja A — Motor

| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| A4.1 | Conectar `engine.reset()` con estado inicial (limpia snapshots, tablero) | ✅ | 5 min |
| A4.2 | Tests: reset completo, limpieza de snapshots (2 tests) | ✅ | 5 min |
| A4.3 | Implementar snapshot stack (`saveSnapshot()`, `cloneBoard()`) | ✅ | 10 min |
| A4.4 | Implementar `undoLastMove()` — restaurar estado, no permitir en game-over | ✅ | 5 min |
| A4.5 | Tests: deshacer, múltiples deshacer, jugar tras deshacer (6 tests) | ✅ | 10 min |

### Pareja B — UI/UX

| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| B4.1 | Crear componente `<GameControls />` con botón "Nuevo Juego" | ✅ | 8 min |
| B4.2 | Conectar con `engine.reset()` en App.tsx (sin crear nuevo engine) | ✅ | 3 min |
| B4.3 | Agregar botón "Deshacer" en `<GameControls />` | ✅ | 5 min |
| B4.4 | Conectar con `engine.undoLastMove()` — deshabilitar si no hay historial | ✅ | 3 min |

### Integración

| Actividad | Estado | Tiempo real |
|-----------|--------|-------------|
| Probar flujo: mover → deshacer → ficha vuelve atrás → turno restaurado | ✅ | 5 min |
| Probar reset tras varios movimientos | ✅ | 3 min |
| Probar deshacer deshabilitado en game-over y sin historial | ✅ | 2 min |
| `pnpm build` y `pnpm test` pasan (57 tests) | ✅ | 2 min |

---

## 4. Código Generado

### Archivos creados/modificados por pareja

#### Pareja A — Motor

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/engine/game.ts` | Modificado | `saveSnapshot()` antes de cada `executeMove`; `undoLastMove()` restaura snapshot; `reset()` limpia snapshots |
| `src/engine/game.test.ts` | Modificado | 8 nuevos tests: undo (6) + reset con snapshots (2) |

#### Pareja B — UI/UX

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/components/GameControls/GameControls.tsx` | Creado | Botones Nuevo Juego y Deshacer con estados disabled/hover |
| `src/App.tsx` | Modificado | `handleReset` usa `engine.reset()`; `handleUndo` llama `undoLastMove`; GameControls integrado |

### Tests

```
✓ src/engine/board.test.ts (14 tests)
✓ src/engine/game.test.ts (36 tests)
  ✓ selectPiece (5)
  ✓ getValidMoves (4)
  ✓ chain jumps (2)
  ✓ executeMove (7)
  ✓ checkVictory (4)
  ✓ switchTurn (2)
  ✓ undoLastMove (6)
  ✓ reset (4)
  ✓ game over (2)
✓ src/components/TurnIndicator/TurnIndicator.test.tsx (3 tests)
✓ src/components/VictoryModal/VictoryModal.test.tsx (4 tests)
```

---

## 5. Demostración

### Funcionalidades funcionando

- **Deshacer movimiento:** Cada `executeMove` guarda un snapshot del estado. `undoLastMove()` restaura el estado anterior, incluyendo posición de fichas, turno, e historial.
- **Múltiples deshacer:** Se pueden deshacer todos los movimientos en orden inverso (LIFO).
- **Jugar tras deshacer:** Después de deshacer, se puede seguir jugando normalmente.
- **Reset completo:** `engine.reset()` reinicia tablero, limpia snapshots e historial.
- **Botón Nuevo Juego:** Reinicia la partida desde cero.
- **Botón Deshacer:** Se deshabilita visualmente cuando no hay historial o el juego terminó.
- **VictoryModal con reset:** El modal de victoria también reinicia la partida.

### Flujo completo del juego

```text
1. Click en ficha → anillo dorado + puntos verdes
2. Click en destino válido → ficha se mueve, turno cambia
3. Click "Deshacer" → ficha vuelve atrás, turno restaurado
4. (Repetir hasta victoria)
5. Modal de victoria → "Nuevo Juego" reinicia la partida
6. O click "Nuevo Juego" en cualquier momento para reiniciar
```

### Problemas encontrados

- **Clonación profunda:** `GameState` contiene un `Map<string, Cell>` que requiere clonación manual. Se implementó `cloneBoard()` que copia cada celda con su coordenada.
- **Snapshot completo:** Se decidió guardar el `GameState` completo (no solo diff) para simplicidad y corrección.
- **Reset con engine.reset():** En Iteración 3 se creaba un nuevo `GameEngine` para reiniciar. Ahora se reutiliza el mismo engine con `engine.reset(GAME_CONFIG)`, que es más eficiente y consistente.

---

## 6. Prácticas XP Aplicadas

| Práctica | ¿Se aplicó? | Comentario |
|----------|-------------|------------|
| Planning Poker | ✅ | Votación para HU-9 (2 pts) y HU-10 (3 pts). Consenso rápido. |
| Pair Programming | ✅ | Trabajo independiente con revisión cruzada. |
| TDD | ✅ | 8 tests escritos antes de implementar `undoLastMove` y `reset`. 4 tests fallando inicialmente. |
| Simple Design | ✅ | Snapshot stack (array) con clonación completa del estado. Sin over-engineering. |
| Refactoring | ✅ | App.tsx simplificado: reutiliza `engine.reset()` en vez de crear nuevo engine. |
| Testing continuo | ✅ | `pnpm test:run` tras cada cambio. 57 tests pasando. |
| Integración frecuente | ✅ | GameControls se integró en App.tsx; `handleUndo` conecta UI con engine. |
| Demo | ✅ | Flujo completo demostrado: juego → deshacer → reiniciar → victoria modal. |
| Retrospectiva | ✅ | Este documento. |

---

## 7. Retrospectiva

### Qué salió bien

- El snapshot stack con clonación completa del estado funciona correctamente para deshacer
- `undoLastMove()` rechaza correctamente cuando no hay historial o el juego terminó
- `reset()` limpia snapshots, evitando que se pueda deshacer después de reiniciar
- El botón "Deshacer" se deshabilita visualmente cuando no aplica, guiando al usuario
- 57 tests en total, cubriendo todas las funcionalidades del juego

### Qué mejorar

- La clonación manual del `GameState` es verbosa — se podría usar `structuredClone()` en entornos que lo soporten
- El snapshot stack crece sin límite — para partidas muy largas, podría consumir memoria
- El botón "Deshacer" actualmente deshace un solo movimiento; en Damas Chinas reales a veces se deshacen cadenas completas
- `engine.reset()` recibe un `GameConfig` que podría omitirse si solo se quiere reiniciar con la misma configuración

### Acciones para la próxima iteración

1. (Opcional) Agregar animaciones de transición para movimientos y deshacer
2. (Opcional) Mejorar feedback visual cuando el botón "Deshacer" está deshabilitado
3. (Opcional) Implementar deshacer de cadenas completas de saltos
4. El juego es completo y funcional — considerar pruebas de usuario
