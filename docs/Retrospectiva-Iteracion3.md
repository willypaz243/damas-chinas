# Retrospectiva — Iteración 3

## 1. Información General

| Campo | Valor |
|-------|-------|
| **Iteración** | 3 |
| **Duración** | Trabajo independiente (1.5–2 horas) |
| **Objetivo** | Saltos en cadena y detección de victoria |
| **Pareja A (Motor)** | Programador 1 + Programador 2 |
| **Pareja B (UI/UX)** | Programador 3 + Programador 4 |

---

## 2. Historias Trabajadas

| Historia | Nombre | Prioridad | Puntos XP | Estado |
|----------|--------|-----------|-----------|--------|
| HU-6 | Saltos en cadena | Alta | 6 | ✅ Completada |
| HU-7 | Detección de victoria | Alta | 5 | ✅ Completada |

**Puntos XP planificados:** 11  
**Puntos XP logrados:** 11  
**Velocidad del equipo:** ~5.5 pts / hora

### Planning Poker

| Miembro | HU-6 (voto) | HU-7 (voto) |
|---------|-------------|-------------|
| Programador 1 (Motor) | 6 | 5 |
| Programador 2 (Motor) | 6 | 5 |
| Programador 3 (UI/UX) | 5 | 5 |
| Programador 4 (UI/UX) | 6 | 5 |
| **Consenso final** | **6** | **5** |

---

## 3. Tareas Ejecutadas

### Pareja A — Motor

| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| A3.1 | Implementar `findJumpChain()` con DFS | ✅ | 15 min |
| A3.3 | Validar cadenas en múltiples direcciones | ✅ | 5 min |
| A3.4 | Tests: saltos simples, complejos, bloqueados (2 tests) | ✅ | 10 min |
| A3.5 | Implementar `checkVictory()` — verificar 10 fichas en zona objetivo | ✅ | 10 min |
| A3.6 | Tests: victoria completa, parcial, sin victoria (4 tests) | ✅ | 10 min |

### Pareja B — UI/UX

| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| B3.1 | Crear componente `<VictoryModal />` con React Portal | ✅ | 10 min |
| B3.2 | Mostrar ganador con color personalizado + botón reiniciar | ✅ | 8 min |

### Integración

| Actividad | Estado | Tiempo real |
|-----------|--------|-------------|
| Conectar `checkVictory` en `executeMove` para marcar `isGameOver`/`winner` | ✅ | 5 min |
| Conectar `VictoryModal` en App.tsx — mostrar al ganar, reiniciar al clickar botón | ✅ | 5 min |
| Verificar flujo completo: mover última ficha → modal de victoria → reiniciar | ✅ | 5 min |
| `pnpm build` y `pnpm test` pasan (49 tests) | ✅ | 3 min |

---

## 4. Código Generado

### Archivos creados/modificados por pareja

#### Pareja A — Motor

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/engine/game.ts` | Modificado | `getJumpMoves()` reemplazado por `findJumpChain()` DFS; implementado `checkVictory()` con `getTargetZoneCells()` |
| `src/engine/game.test.ts` | Modificado | 12 nuevos tests: saltos en cadena (2), victoria (4), game-over (2), más helpers de test |

#### Pareja B — UI/UX

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/components/VictoryModal/VictoryModal.tsx` | Creado | Modal con portal, círculo de color, nombre del ganador, botón "Nuevo Juego" |
| `src/components/VictoryModal/VictoryModal.test.tsx` | Creado | 4 tests: renderizado, ganador, botón reset, click handler |
| `src/App.tsx` | Modificado | Import VictoryModal, `handleReset`, mostrar modal en game over, bloquear clicks si game over |

### Tests

```
✓ src/engine/board.test.ts (14 tests)
✓ src/engine/game.test.ts (28 tests)
  ✓ selectPiece (5 tests)
  ✓ getValidMoves (4 tests)
  ✓ chain jumps (2 tests)
  ✓ executeMove (7 tests)
  ✓ checkVictory (4 tests)
  ✓ switchTurn (2 tests)
  ✓ reset (2 tests)
  ✓ game over (2 tests)
✓ src/components/TurnIndicator/TurnIndicator.test.tsx (3 tests)
✓ src/components/VictoryModal/VictoryModal.test.tsx (4 tests)
```

---

## 5. Demostración

### Funcionalidades funcionando

- **Saltos en cadena (DFS):** Una ficha puede saltar sobre varias piezas consecutivas en un solo turno
- **Validación de saltos:** No permite saltar si la casilla destino intermedia está ocupada
- **Movimientos mixtos:** `getValidMoves` retorna pasos adyacentes + saltos en cadena
- **Detección de victoria:** Cuando un jugador coloca sus 10 fichas en el triángulo opuesto, se declara ganador
- **VictoryModal:** Overlay con portal React, círculo del color del ganador, nombre y botón "Nuevo Juego"
- **Reset:** Al hacer click en "Nuevo Juego", el tablero vuelve al estado inicial
- **Bloqueo de interacción:** No se pueden seleccionar fichas cuando el juego ha terminado

### Flujo completo de victoria

```text
1. Última ficha de Jugador 1 llega al triángulo norte
2. executeMove() llama a checkVictory() → Jugador 1 gana
3. isGameOver = true, winner = Jugador 1
4. VictoryModal aparece con círculo rojo + "Jugador 1"
5. Click en "Nuevo Juego" → tablero reinicia, modal desaparece
```

### Problemas encontrados

- **DFS revisit:** La primera implementación de DFS no evitaba revisitar celdas, causando bucles infinitos. Se corrigió con un `Set<string> visited` pasado por parámetro.
- **Tests de game-over:** El test de victoria necesitaba que la última ficha estuviera a un paso de la zona objetivo. Se identificó que la celda `(0,-5)` no es una posición válida del tablero (dos coordenadas > 4). Se corrigió usando `(1,-5)` como destino.
- **Reset con useState:** No se podía resetear el engine directamente (inmutable). Se resolvió creando un nuevo `GameEngine` en `handleReset`.

---

## 6. Prácticas XP Aplicadas

| Práctica | ¿Se aplicó? | Comentario |
|----------|-------------|------------|
| Planning Poker | ✅ | Votación para HU-6 (6 pts) y HU-7 (5 pts). Consenso rápido. |
| Pair Programming | ✅ | Trabajo independiente con revisión cruzada. |
| TDD | ✅ | Tests escritos antes de implementar `findJumpChain` y `checkVictory`. 4 tests fallando inicialmente. |
| Simple Design | ✅ | DFS recursivo con visited set; `getTargetZoneCells` basado en coordenadas axiales existentes. |
| Refactoring | ✅ | `getJumpMoves()` reemplazado por `findJumpChain()` más potente. |
| Testing continuo | ✅ | `pnpm test:run` ejecutado tras cada cambio. 49 tests pasando. |
| Integración frecuente | ✅ | `executeMove` integra `checkVictory`; App.tsx integra `VictoryModal`. |
| Demo | ✅ | Flujo completo demostrado: cadena de saltos → victoria → modal → reinicio. |
| Retrospectiva | ✅ | Este documento. |

---

## 7. Retrospectiva

### Qué salió bien

- El DFS para saltos en cadena fue implementado de forma limpia y eficiente, reemplazando la búsqueda de saltos simples
- `checkVictory()` se integró directamente en `executeMove`, asegurando que la victoria se detecta automáticamente
- El `VictoryModal` con portal React se integró sin fricción gracias a props bien definidas
- El reset del juego creando un nuevo `GameEngine` resultó en un reinicio limpio sin estado residual
- 12 nuevos tests (49 total) cubren saltos, victoria y game-over

### Qué mejorar

- El test de game-over requirió depuración de coordenadas del tablero — sería útil tener una función `isValidMove` probada por separado
- El DFS con `visited` set requiere cuidado con la inmutabilidad (crear nuevo Set en cada llamada recursiva)
- El mensaje de error del modal podría ser más descriptivo cuando no hay ganador
- Falta una animación de transición para cuando aparece/desaparece el modal

### Acciones para la próxima iteración

1. Implementar deshacer movimiento (HU-10) con snapshot stack
2. Implementar reinicio con botón dedicado en la UI (HU-9) — ya parcialmente hecho con VictoryModal
3. Agregar animaciones y transiciones al VictoryModal
4. Continuar con TDD para todas las nuevas funcionalidades
5. Hacer una pasada de pulido visual final
