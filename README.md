# Damas Chinas

Juego de Damas Chinas (Chinese Checkers) para 2 jugadores implementado con React 19, TypeScript 6 y Vite 8.
Desarrollado siguiendo la metodología **Extreme Programming (XP)** con pair programming, TDD entrega iterativa.

---

## Tecnologías

| Categoría   | Tecnología             | Versión |
| ----------- | ---------------------- | ------- |
| Framework   | React                  | 19.2.6  |
| Lenguaje    | TypeScript             | 6.0.3   |
| Build       | Vite                   | 8.0.13  |
| Tests       | Vitest                 | 4.1.6   |
| Testing DOM | @testing-library/react | 16.3.2  |
| Linter      | ESLint                 | 10.4.0  |
| Husky       | Git hooks              | 9.1.7   |

---

## Requisitos

- [Node.js](https://nodejs.org/) >= 18.x
- [pnpm](https://pnpm.io/) >= 8.0

## Instalación

```bash
pnpm install
```

## Comandos

| Comando           | Descripción                 |
| ----------------- | --------------------------- |
| `pnpm dev`        | Servidor de desarrollo Vite |
| `pnpm build`      | `tsc -b && vite build`      |
| `pnpm lint`       | `eslint .`                  |
| `pnpm test`       | Vitest interactivo          |
| `pnpm test --run` | Vitest ejecución única      |

---

## Estructura del Proyecto

```
src/
├── engine/
│   ├── board.ts          # HexBoard — geometría del tablero (121 casillas)
│   ├── board.test.ts     # 14 tests de geometría del tablero
│   ├── game.ts           # GameEngine — lógica completa del juego
│   ├── game.test.ts      # 36 tests del motor de juego
│   ├── types.ts          # Contrato compartido entre Motor y UI (interfaces)
│   └── utils.ts          # hexToPixel() — conversión axial → píxel SVG
├── components/
│   ├── Board/
│   │   ├── Board.tsx     # Tablero SVG con 121 hexágonos
│   │   └── HexCell.tsx   # Celda hexagonal individual (polygon)
│   ├── GameControls/
│   │   └── GameControls.tsx  # Botones "Nuevo Juego" y "Deshacer"
│   ├── Piece/
│   │   └── Piece.tsx     # Ficha circular SVG con anillo de selección
│   ├── TurnIndicator/
│   │   ├── TurnIndicator.tsx      # Indicador de turno con color del jugador
│   │   └── TurnIndicator.test.tsx # 3 tests
│   └── VictoryModal/
│       ├── VictoryModal.tsx       # Modal de victoria con React Portal
│       └── VictoryModal.test.tsx  # 4 tests
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── styles/
│   ├── Board.module.css
│   └── globals.css
├── App.tsx               # Componente principal con useEngine hook
├── index.css             # Estilos globales (tema oscuro)
└── main.tsx              # Punto de entrada React
```

---

## Reglas del Juego

- **Tablero:** Estrella de David de 6 puntas con 121 casillas hexagonales en coordenadas axiales (q, r).
- **Jugadores:** 2 jugadores.
  - **Jugador 1 (rojo, #e74c3c):** 10 fichas en la punta sur (r > 4).
  - **Jugador 2 (azul, #3498db):** 10 fichas en la punta norte (r < -4).
- **Movimientos:**
  - **Paso:** A una casilla adyacente vacía.
  - **Salto:** Sobre una ficha adyacente (propia o del oponente) hacia una casilla vacía inmediatamente detrás.
  - **Saltos en cadena:** Múltiples saltos consecutivos en un solo turno (DFS).
- **Victoria:** El primer jugador en colocar sus 10 fichas en el triángulo opuesto gana.
- **Turnos:** Automáticos después de cada movimiento.

---

### Contrato de Integración

El archivo `src/engine/types.ts` define los tipos compartidos que ambas parejas acordaron en la Iteración 0:

- `PlayerId` = `1 | 2`
- `HexCoord` = `{ q, r }` — coordenadas axiales
- `Cell` = `{ coord, pieceColor, piecePlayerId }`
- `GameState` = `{ board, players, currentPlayer, moveHistory, selectedPiece, validMoves, winner, isGameOver }`
- `GameEngine` — interfaz con métodos: `getConfig`, `getState`, `selectPiece`, `executeMove`, `switchTurn`, `checkVictory`, `undoLastMove`, `reset`

## Arquitectura

### Motor (Engine)

- **`HexBoard`** (`src/engine/board.ts`): Genera 121 celdas en forma de estrella de 6 puntas usando coordenadas axiales. La condición `|q|,|r|,|s| <= 8` con máximo 1 coordenada `> 4` define la forma válida. Proporciona `getNeighbors()` para las 6 direcciones hexagonales.
- **`GameEngine`** (`src/engine/game.ts`): Gestiona el estado completo del juego.
  - `selectPiece()`: Valida turno, propietario y posición; retorna movimientos válidos.
  - `getValidMoves()`: Retorna pasos adyacentes + cadenas de salto.
  - `findJumpChain()`: DFS recursivo con `Set<string> visited` para evitar bucles infinitos.
  - `executeMove()`: Valida movimiento, guarda snapshot, actualiza tablero, verifica victoria, cambia turno.
  - `checkVictory()`: Verifica si 10 fichas del jugador están en la zona objetivo opuesta.
  - `undoLastMove()`: Restaura el snapshot completo anterior (pila LIFO).
  - `reset()`: Limpia tablero, historial y snapshots.
- **`hexToPixel()`** (`src/engine/utils.ts`): Convierte coordenadas axiales (q, r) a píxeles SVG.

### UI (Componentes React)

- **`Board`**: Renderiza SVG con 121 `<HexCell>`, las fichas como `<Piece>` y puntos verdes para movimientos válidos. Usa `pointerEvents="none"` en las piezas para permitir clicks en los polígonos subyacentes.
- **`Piece`**: Círculo SVG con color del jugador y anillo dorado (`#f1c40f`) cuando está seleccionada.
- **`TurnIndicator`**: Muestra el jugador activo con un círculo de su color y texto "Turno de: Jugador X".
- **`VictoryModal`**: Overlay con `createPortal` a `document.body`. Muestra círculo del color del ganador, etiqueta "Ganador", nombre y botón "Nuevo Juego".
- **`GameControls`**: Botones "Nuevo Juego" (reinicio) y "Deshacer" (deshabilitado si no hay historial o el juego terminó).
- **`useEngine` hook** (en `App.tsx`): Encapsula toda la lógica de estado del juego usando `useState` y `useCallback`.

---

## Tests

El proyecto cuenta con **57 tests unitarios**:

| Archivo                                               | Tests | Cobertura                                                                                                                                          |
| ----------------------------------------------------- | :---: | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/engine/board.test.ts`                            |  14   | Geometría del tablero, vecinos, puntas                                                                                                             |
| `src/engine/game.test.ts`                             |  36   | selectPiece (5), getValidMoves (4), chain jumps (2), executeMove (7), checkVictory (4), switchTurn (2), undoLastMove (6), reset (4), game over (2) |
| `src/components/TurnIndicator/TurnIndicator.test.tsx` |   3   | Renderizado, texto, cambio de jugador                                                                                                              |
| `src/components/VictoryModal/VictoryModal.test.tsx`   |   4   | Renderizado, ganador, botón, click handler                                                                                                         |

---

## Licencia

MIT
