# Damas Chinas — Documentación XP

## Equipo

- **Programador 1** — Pareja A (Motor)
- **Programador 2** — Pareja A (Motor)
- **Programador 3** — Pareja B (UI/UX)
- **Programador 4** — Pareja B (UI/UX)

## Resumen del Proyecto

Implementación del juego Damas Chinas (Chinese Checkers) para 2 jugadores utilizando
metodología Extreme Programming (XP). El juego permite seleccionar fichas, visualizar
movimientos válidos (paso adyacente y salto básico), ejecutar movimientos con cambio
automático de turno, e indica visualmente qué jugador está activo.

---

## Fases XP Aplicadas

### Exploración (Iteración 0)

- Se elaboraron 10 historias de usuario con criterios de aceptación
- Se definió el contrato de integración (`types.ts`) entre Pareja A (Motor) y Pareja B (UI/UX)
- Se realizó planning poker para estimar puntos XP de cada historia
- Ver: [HistoriasDeUsuario.md](HistoriasDeUsuario.md)
- Ver: [Planificacion.md](Planificacion.md)

### Planificación

- Se priorizaron las historias por valor del MVP
- Velocidad estimada: 8-10 pts XP por sesión de 40 min
- Se definieron tareas de ingeniería para cada HU
- Contrato de integración: `types.ts` compartido entre parejas

### Iteración 1 — Tablero + Fichas Iniciales

| Elemento | Detalle |
|----------|---------|
| **Historias** | HU-1 (tablero, 3 pts), HU-2 (fichas, 2 pts) |
| **Resultado** | Tablero SVG con 121 casillas hexagonales y 20 fichas estáticas (10 rojas sur + 10 azules norte) |
| **Tests** | 14 tests de geometría del tablero |
| **Ver:** | [Retrospectiva-Iteracion1.md](Retrospectiva-Iteracion1.md) |

### Iteración 2 — Juego Jugable (MVP)

| Elemento | Detalle |
|----------|---------|
| **Historias** | HU-3 (selección, 3 pts), HU-4 (movimiento, 3 pts), HU-5 (turno, 2 pts), HU-8 (indicador, 2 pts) |
| **Resultado** | 🎮 **Primer build jugable.** Se puede seleccionar ficha, ver movimientos válidos (puntos verdes), mover y cambiar turno. Indicador visual del jugador activo. |
| **Tests** | 37 tests totales (14 board + 20 game + 3 UI) |
| **Ver:** | [Retrospectiva-Iteracion2.md](Retrospectiva-Iteracion2.md) |

### Iteración 3 — Saltos + Victoria (Pendiente)

| Elemento | Detalle |
|----------|---------|
| **Historias** | HU-6 (saltos en cadena, 6 pts), HU-7 (victoria, 5 pts) |
| **Resultado** | Pendiente de implementar |
| **Ver:** | [Retrospectiva-Iteracion3.md](Retrospectiva-Iteracion3.md) |

### Iteración 4 — Pulido (Pendiente)

| Elemento | Detalle |
|----------|---------|
| **Historias** | HU-9 (reiniciar, 2 pts), HU-10 (deshacer, 3 pts) |
| **Resultado** | Pendiente de implementar |
| **Ver:** | [Retrospectiva-Iteracion4.md](Retrospectiva-Iteracion4.md) |

---

## Prácticas XP Aplicadas

| Práctica | Iteración 1 | Iteración 2 |
|----------|-------------|-------------|
| **Planning Poker** | ✅ Votación para HU-1, HU-2 | ✅ Votación para HU-3, HU-4, HU-5, HU-8 |
| **Pair Programming** | ✅ Driver/Navigator por pareja | ✅ Roles intercambiados |
| **TDD** | ✅ Tests antes de `HexBoard` | ✅ Tests antes de `GameEngine` |
| **Simple Design** | ✅ Sin over-engineering | ✅ Estado inmutable, hook separado |
| **Refactoring continuo** | ✅ `hexToPixel()` extraída | ✅ `selectPiece()` actualizada |
| **Testing continuo** | ✅ 14 tests Vitest | ✅ 37 tests Vitest |
| **Integración frecuente** | ✅ Board + GameState | ✅ useEngine + TurnIndicator |
| **Demo** | ✅ Tablero + fichas estáticas | ✅ 🎮 Flujo jugable completo |
| **Retrospectiva** | ✅ Documentada | ✅ Documentada |

---

## Cómo Ejecutar el Proyecto

```bash
pnpm install       # Instalar dependencias
pnpm dev           # Servidor de desarrollo (Vite)
pnpm build         # Build de producción
pnpm test:run      # Ejecutar todos los tests
```

### Requisitos

- **Node.js** >= 18
- **pnpm** >= 8

---

## Estructura del Proyecto

```
src/
├── engine/
│   ├── board.ts          # HexBoard — geometría del tablero (121 casillas)
│   ├── board.test.ts     # 14 tests del tablero
│   ├── game.ts           # GameEngine — lógica del juego
│   ├── game.test.ts      # 20 tests del motor
│   ├── types.ts          # Contrato compartido (interfaces)
│   └── utils.ts          # hexToPixel()
├── components/
│   ├── Board/
│   │   ├── Board.tsx     # Tablero SVG
│   │   └── HexCell.tsx   # Celda hexagonal
│   ├── Piece/
│   │   └── Piece.tsx     # Ficha circular SVG
│   └── TurnIndicator/
│       ├── TurnIndicator.tsx      # Indicador de turno
│       └── TurnIndicator.test.tsx # 3 tests
├── App.tsx               # Punto de entrada con useEngine hook
├── index.css             # Estilos globales
└── main.tsx              # Montaje React
```

---

## Capturas del Juego

### Iteración 1 — Tablero con fichas iniciales

```text
Tablero SVG con 121 hexágonos + 20 fichas (10 rojas sur, 10 azules norte)
```

### Iteración 2 — Juego funcional

```text
1. Click en ficha propia → anillo dorado + puntos verdes en destinos válidos
2. Click en destino → ficha se mueve
3. Turno cambia automáticamente al otro jugador
4. Indicador visual "Turno de: Jugador X" con color del jugador activo
```
