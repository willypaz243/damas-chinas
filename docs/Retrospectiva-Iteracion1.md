# Retrospectiva — Iteración 1

## 1. Información General

| Campo | Valor |
|-------|-------|
| **Iteración** | 1 |
| **Duración** | 40 minutos (Clase 1) |
| **Objetivo** | Tablero renderizado con fichas iniciales estáticas |
| **Pareja A (Motor)** | Programador 1 + Programador 2 |
| **Pareja B (UI/UX)** | Programador 3 + Programador 4 |

---

## 2. Historias Trabajadas

| Historia | Nombre | Prioridad | Puntos XP | Estado |
|----------|--------|-----------|-----------|--------|
| HU-1 | Ver tablero renderizado | Alta | 3 | ✅ Completada |
| HU-2 | Fichas iniciales colocadas | Alta | 2 | ✅ Completada |

**Puntos XP planificados:** 5  
**Puntos XP logrados:** 5  
**Velocidad del equipo:** 5 pts / 40 min

### Planning Poker

| Miembro | HU-1 (voto) | HU-2 (voto) |
|---------|-------------|-------------|
| Programador 1 (Motor) | 3 | 2 |
| Programador 2 (Motor) | 3 | 3 |
| Programador 3 (UI/UX) | 3 | 2 |
| Programador 4 (UI/UX) | 2 | 2 |
| **Consenso final** | **3** | **2** |

---

## 3. Tareas Ejecutadas

### Pareja A — Motor (Driver: Programador 1, Navigator: Programador 2)

| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| A1.1 | Definir `HexBoard` con 121 casillas y `isValidPosition()` | ✅ | 12 min |
| A1.2 | Implementar `getNeighbors()` para adyacencia | ✅ | 5 min |
| A1.3 | Tests: validar posiciones y vecinos (14 tests) | ✅ | 8 min |

### Pareja B — UI/UX (Driver: Programador 3, Navigator: Programador 4)

| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| B1.1 | Crear componente `<Board />` con `<svg>` | ✅ | 10 min |
| B1.2 | Mapear coordenadas axiales → SVG pixel coords | ✅ | 5 min |
| B1.3 | Crear componente `<HexCell />` con `polygon` | ✅ | 5 min |
| B1.4 | Crear componente `<Piece />` circular SVG | ✅ | 5 min |
| B1.5 | Renderizar 20 fichas (10+10) en posiciones iniciales | ✅ | 5 min |

### Integración

| Actividad | Estado | Tiempo real |
|-----------|--------|-------------|
| Unir `GameState` con `<Board />` — pasar estado por props | ✅ | 5 min |
| Verificar que `pnpm build` y `pnpm test` pasan | ✅ | 3 min |
| Verificar que `pnpm dev` muestra tablero + fichas | ✅ | 2 min |

---

## 4. Código Generado

### Archivos creados/modificados por pareja

#### Pareja A — Motor

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/engine/board.ts` | Creado | Clase `HexBoard` con 121 casillas, `isValidPosition()`, `getNeighbors()` |
| `src/engine/board.test.ts` | Creado | 14 tests unitarios sobre geometría del tablero |
| `src/engine/types.ts` | Modificado | Tipos compartidos (`HexCoord`, `Cell`, `GameState`, etc.) |
| `src/engine/utils.ts` | Creado | Función `hexToPixel()` para conversión axial → píxel |

#### Pareja B — UI/UX

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `src/components/Board/Board.tsx` | Creado | Componente SVG que renderiza tablero completo |
| `src/components/Board/HexCell.tsx` | Creado | Componente de celda hexagonal (polygon SVG) |
| `src/components/Piece/Piece.tsx` | Creado | Componente de ficha (circle SVG) |
| `src/App.tsx` | Modificado | Renderiza `<Board>` con estado inicial de 20 fichas |
| `src/index.css` | Creado | Estilos oscuros con layout centrado |
| `vite.config.ts` | Modificado | Import desde `vitest/config` para compatibilidad |

### Tests

```
✓ src/engine/board.test.ts (14 tests)
  ✓ HexBoard > debe tener exactamente 121 casillas
  ✓ HexBoard > debe validar el centro (0,0)
  ✓ HexBoard > debe validar la punta sur (-4, 8)
  ✓ HexBoard > debe validar la punta norte (4, -8)
  ✓ HexBoard > debe rechazar posiciones en espacios vacíos entre puntas
  ✓ HexBoard > debe rechazar posiciones fuera del límite máximo de 8
  ✓ HexBoard > debe devolver 6 vecinos para el centro
  ✓ HexBoard > debe devolver 2 vecinos para la punta sur
  ✓ HexBoard > debe devolver 5 vecinos en borde del hexágono central
  ✓ HexBoard > debe devolver todas las casillas como HexCoord
  ✓ HexBoard > cada vecino debe ser una posición válida
  ✓ HexBoard > debe tener 10 casillas en la punta sur
  ✓ HexBoard > debe tener 10 casillas en la punta norte
```

---

## 5. Demostración

### Funcionalidades funcionando

- Tablero de Damas Chinas renderizado como SVG con 121 casillas hexagonales
- Forma de estrella de 6 puntas con coordenadas axiales (puntoy-top)
- 10 fichas rojas (Jugador 1) colocadas en la punta sur
- 10 fichas azules (Jugador 2) colocadas en la punta norte
- Las fichas se renderizan sobre las casillas correspondientes
- El tablero se adapta al tamaño de la ventana mediante viewBox SVG
- Tema oscuro centrado con estilo limpio

### Resultado visual

```text
Tablero SVG con 121 hexágonos + 20 círculos (fichas)
Configuración inicial:
  - Sur (r > 4):  10 fichas rojas   (#e74c3c)
  - Norte (r < -4): 10 fichas azules  (#3498db)
  - Centro: vacío
```

### Problemas encontrados

- El build fallaba inicialmente por la configuración de vitest en `vite.config.ts` — se corrigió importando desde `vitest/config`
- Archivo `game.test.ts` vacío causaba error en la suite de tests — se eliminó hasta implementar el motor de juego
- Estimaciones de vecinos incorrectas en tests iniciales (puntas tienen 2 vecinos, no 3) — corregidas tras verificar geometría del tablero

---

## 6. Prácticas XP Aplicadas

| Práctica | ¿Se aplicó? | Comentario |
|----------|-------------|------------|
| Planning Poker | ✅ | Votación para HU-1 (3 pts) y HU-2 (2 pts). Consenso rápido. |
| Pair Programming | ✅ | Pareja A: Programador 1 (driver) + Programador 2 (navigator). Pareja B: Programador 3 (driver) + Programador 4 (navigator). |
| TDD | ✅ | Tests escritos antes de implementar `HexBoard`. 14 tests definidos primero, luego código. |
| Simple Design | ✅ | Diseño mínimo: clase `HexBoard` con solo lo necesario (121 casillas, isValidPosition, getNeighbors). Sin over-engineering. |
| Refactoring | ✅ | Se extrajo `hexToPixel()` a utilidad compartida para evitar duplicación entre `HexCell` y `Board`. |
| Testing continuo | ✅ | `pnpm test:run` ejecutado frecuentemente. 14 tests pasando. |
| Integración frecuente | ✅ | Board se integró con el estado mockeado (`Map<string, Cell>`). Compatible con `GameState.board` de `types.ts`. |
| Demo | ✅ | Tablero visible en `pnpm dev` con 121 hexágonos y 20 fichas en posición inicial. |
| Retrospectiva | ✅ | Este documento. |

---

## 7. Retrospectiva

### Qué salió bien

- El diseño del tablero con coordenadas axiales y la condición `highCount <= 1` para la estrella de 6 puntas resultó en una implementación limpia y correcta (121 casillas exactas)
- TDD permitió detectar y corregir errores en las expectativas de vecinos antes de integrar
- La separación clara entre Motor (geometría) y UI (renderizado) permitió trabajar en paralelo sin conflictos
- El contrato de integración (`types.ts`) evitó desajustes al unir componentes
- La función `hexToPixel()` compartida eliminó duplicación de lógica de coordenadas

### Qué mejorar

- Algunas estimaciones de vecinos no fueron precisas inicialmente — validar con script antes de escribir tests
- El archivo `game.test.ts` vacío debería haberse eliminado al inicio para no interferir con la suite
- La configuración de vitest dentro de `vite.config.ts` requiere import específico — documentar o mover a `vitest.config.ts`

### Acciones para la próxima iteración

1. Verificar que `game.ts` esté listo o al menos un stub antes de empezar Iteración 2
2. Mantener el mismo ritmo de pair programming con TDD
3. Documentar la configuración de herramientas para evitar problemas de build
4. En Iteración 2, enfocarse en el flujo completo: seleccionar ficha → mover → cambiar turno
