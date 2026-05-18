# HU-A1 — Estado del tablero

## Objetivo
Implementar la base del motor para representar el tablero de Damas Chinas como estado puro en TypeScript.

## Archivos modificados
- `src/engine/board.ts`
- `src/engine/board.test.ts`

## Qué se implementó
- Clase `HexBoard` que inicializa el tablero con 121 casillas válidas.
- Cada casilla guarda:
  - coordenada axial `q,r`
  - `pieceColor: null`
  - `piecePlayerId: null`
- Método `HexBoard.isValidPosition(q, r)` para validar si una coordenada pertenece a la estrella de David del tablero.
- Método `HexBoard.getNeighbors(coord)` para obtener los seis vecinos hexagonales válidos de una casilla.
- Función `HexBoard.getKey(coord)` para normalizar la clave de almacenamiento en `Map<string, Cell>`.

## Detalles técnicos
- El tablero se construye en un rango de `q` y `r` de `-8` a `8`.
- Se utiliza la propiedad axial de los hexágonos con `s = -q - r`.
- La condición de validez incluye:
  - zona central de radio 4
  - las seis puntas del tablero (triángulos de jugadores)
- El estado interno se guarda en `Map<string, Cell>` para acceso rápido por coordenada.

## Pruebas
Se añadieron pruebas unitarias en `src/engine/board.test.ts`.
- Verifica que el tablero tiene `121` casillas válidas.
- Verifica que la casilla central (`0,0`) devuelve `6` vecinos.
- Verifica que coordenadas fuera de la forma del tablero son inválidas.

## Cómo ejecutar
```bash
cd /home/willypaz/Workspace/projects/WillyProjects/damas-chinas
./node_modules/.bin/vitest run src/engine/board.test.ts
```

## Estado actual
- HU-A1 implementada y verificada.
- El tablero está listo para que el siguiente paso sea posicionar fichas iniciales y desarrollar la lógica del juego.
