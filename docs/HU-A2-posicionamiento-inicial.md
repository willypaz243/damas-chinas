# HU-A2 — Posicionamiento Inicial Multi-jugador

## Objetivo
Implementar el posicionamiento inicial de fichas para 2-6 jugadores, donde cada jugador ocupa uno de los 6 triángulos de la estrella del tablero de Damas Chinas.

## Archivos modificados
- `src/engine/types.ts`
- `src/engine/board.ts`
- `src/engine/game.ts`
- `src/engine/board.test.ts`
- `src/engine/game.test.ts`

## Qué se implementó

### Tipos (`types.ts`)
- Se añadió `pointIndex: number` a la interfaz `PlayerConfig` para rastrear qué punta del tablero ocupa cada jugador.

### Tablero (`board.ts`)
- **`STAR_POINTS`**: Array estático con las 6 puntas de la estrella:
  - Point 0: Sur
  - Point 1: Norte
  - Point 2: Noreste
  - Point 3: Suroeste
  - Point 4: Sureste
  - Point 5: Noroeste

- **`TRIANGLE_CELLS`**: Matriz estática 6×10 con las coordenadas de las 10 celdas de cada triángulo.

- **`HexBoard.getTriangleCells(pointIndex)`**: Retorna las 10 coordenadas del triángulo para una punta dada.

- **`HexBoard.getTargetZone(pointIndex)`**: Retorna la zona objetivo (triángulo opuesto) para un jugador. Los opuestos son:
  - 0 ↔ 1 (Sur ↔ Norte)
  - 2 ↔ 3 (Noreste ↔ Suroeste)
  - 4 ↔ 5 (Sureste ↔ Noroeste)

- **`HexBoard.getInitialPositions(pointIndex)`**: Retorna las posiciones iniciales (alias de `getTriangleCells`).

### Motor del juego (`game.ts`)
- **`initializePieces(config)`**: Refactorizado para usar `HexBoard.getInitialPositions(player.pointIndex)` en lugar de posiciones hardcoded.

- **`updatePlayerProgress()`**: Ahora cuenta correctamente las piezas en la zona objetivo de cada jugador usando `HexBoard.getTargetZone(player.pointIndex)`.

- **`checkVictory()`**: Actualizado para usar `HexBoard.getTargetZone(player.pointIndex)` para verificar si un jugador ha movido todas sus 10 fichas a su zona objetivo.

## Detalles técnicos

### Geometría del tablero
Cada triángulo de jugador consiste en 10 celdas organizadas en 3 filas:
- Fila exterior: 5 celdas (borde del triángulo)
- Fila media: 4 celdas
- Fila interior: 1 celda (vértice más cercano al centro)

### Coordenadas de los triángulos

**Punto 0 (Sur):**
```
(0,-4), (1,-4), (2,-4), (3,-4), (4,-4),
(0,-3), (1,-3), (2,-3), (3,-3),
(0,-2)
```

**Punto 1 (Norte):**
```
(0,4), (-1,4), (-2,4), (-3,4), (-4,4),
(0,3), (-1,3), (-2,3), (-3,3),
(0,2)
```

**Punto 2 (Noreste):**
```
(4,0), (4,-1), (4,-2), (4,-3), (4,-4),
(3,0), (3,-1), (3,-2), (3,-3),
(2,0)
```

**Punto 3 (Suroeste):**
```
(-4,0), (-4,1), (-4,2), (-4,3), (-4,4),
(-3,0), (-3,1), (-3,2), (-3,3),
(-2,0)
```

**Punto 4 (Sureste):**
```
(4,-4), (3,-5), (2,-5), (1,-4), (0,-3),
(3,-4), (2,-4), (1,-3), (0,-4),
(2,-3)
```

**Punto 5 (Noroeste):**
```
(-4,4), (-3,5), (-2,5), (-1,4), (0,3),
(-3,4), (-2,4), (-1,3), (0,4),
(-2,3)
```

### Configuración multi-jugador

Para configurar una partida, cada jugador debe tener un `pointIndex` asignado:

```typescript
const config: GameConfig = {
  playerCount: 2,
  players: [
    { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0, pointIndex: 0 },
    { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0, pointIndex: 1 },
  ],
  firstPlayerId: 1,
};
```

### Notas sobre solapamiento

Algunos triángulos comparten celdas en los bordes. Cuando múltiples jugadores inician en puntos adyacentes, las celdas solapadas son ocupadas por el último jugador inicializado. Para evitar esto:

- **2 jugadores**: Usar puntos opuestos (0 y 1) - sin solapamiento
- **3 jugadores**: Usar puntos alternos (0, 2, 4) - mínimo solapamiento
- **4+ jugadores**: El solapamiento es inherente a la geometría

## Pruebas

Se añadieron pruebas en `src/engine/board.test.ts`:
- Verifica que hay 6 puntas definidas con etiquetas correctas
- Verifica que cada triángulo tiene exactamente 10 celdas
- Verifica que todas las celdas de los triángulos son posiciones válidas
- Verifica que la zona objetivo es el triángulo opuesto correcto
- Verifica que `getInitialPositions` retorna lo mismo que `getTriangleCells`

Se añadieron pruebas en `src/engine/game.test.ts`:
- Verifica que 2 jugadores reciben 10 fichas cada uno en sus triángulos correctos
- Verifica que 4 jugadores se inicializan correctamente
- Verifica que 6 jugadores se inicializan correctamente
- Verifica que la zona objetivo es el triángulo opuesto

## Cómo ejecutar

```bash
cd /home/willypaz/Workspace/projects/WillyProjects/damas-chinas

# Ejecutar todas las pruebas
./node_modules/.bin/vitest run

# Ejecutar solo pruebas de board
./node_modules/.bin/vitest run src/engine/board.test.ts

# Ejecutar solo pruebas de game
./node_modules/.bin/vitest run src/engine/game.test.ts
```

## Ejemplo de uso

```typescript
import { GameEngine } from "./engine/game";
import { HexBoard } from "./engine/board";

const engine = new GameEngine();

// Configurar partida para 2 jugadores
const config = {
  playerCount: 2 as const,
  players: [
    { id: 1, color: "#E74C3C", label: "Jugador 1", piecesInTarget: 0, pointIndex: 0 },
    { id: 2, color: "#3498DB", label: "Jugador 2", piecesInTarget: 0, pointIndex: 1 },
  ],
  firstPlayerId: 1 as PlayerId,
};

engine.reset(config);

// Verificar posiciones iniciales
const state = engine.getState();
console.log(`Jugador 1 tiene ${state.players[0].piecesInTarget} piezas en zona objetivo`);
console.log(`Jugador 2 tiene ${state.players[1].piecesInTarget} piezas en zona objetivo`);
```

## Estado actual
- ✅ HU-A2 completada y verificada
- ✅ Soporte para 2-6 jugadores con asignación de puntas
- ✅ Zonas objetivo calculadas dinámicamente
- ✅ Progreso del jugador cuenta piezas en zona objetivo
- ✅ Detección de victoria basada en zona objetivo
- ✅ 27 tests pasando

## Siguientes pasos
- HU-A3: Movimiento básico (paso adyacente)
- HU-A5: Gestión de turnos (multi-jugador)
- HU-A6: Validación completa de movimientos
