# HU-B2 — Visualización de Fichas (Componente Piece)

## Objetivo
Implementar el componente React para renderizar fichas circulares SVG con color dinámico por jugador, integrado en el tablero.

## Archivos modificados
- `src/components/Piece/Piece.tsx`
- `src/components/Piece/Piece.module.css`
- `src/components/Piece/Piece.test.tsx`
- `src/components/Board/Board.tsx`
- `src/components/Board/Board.test.tsx`
- `src/App.tsx`
- `vite.config.ts`
- `vitest.config.ts` (nuevo)
- `vitest.setup.ts` (nuevo)

## Qué se implementó

### Componente Piece (`Piece.tsx`)
Componente funcional que renderiza una ficha como un círculo SVG con:
- **Color dinámico**: El color se pasa via prop `color` (HEX o CSS)
- **Tamaño configurable**: Radio definido por prop `r`
- **Posicionamiento**: Coordenadas `cx`, cy` para ubicación en el SVG
- **Estado seleccionado**: Borde dorado y glow cuando `isSelected={true}`
- **Gradiente radial**: Efecto visual para dar profundidad a la ficha

### Estilos CSS (`Piece.module.css`)
- **`.piece`**: Contenedor grupal con transición suave y cursor pointer
- **`.pieceCircle`**: Círculo principal con sombra (drop-shadow)
- **`.pieceCircle.selected`**: Borde dorado (#FFD700) y glow amarillo
- **`.pieceHighlight`**: Círculo interior semitransparente para efecto 3D

### Integración con Board (`Board.tsx`)
- Se añadió prop `state?: GameState` para recibir el estado del juego
- Renderiza las fichas de los jugadores sobre el tablero
- Filtra celdas con `pieceColor !== null && piecePlayerId !== null` para mostrar solo fichas activas
- Aplica `isSelected` basado en `state.selectedPiece`
- Añade gradiente radial SVG en `<defs>` para reutilizar en todas las fichas
- **Corrección de coordenadas**: Se invirtió el eje Y en `hexToPixel()` para que las coordenadas negativas de `r` aparezcan arriba (Y menor) y las positivas abajo (Y mayor)

### Integración en App.tsx
- Inicializa `GameEngine` con configuración de 2 jugadores
- Pasa `gameState` al componente `Board`
- Maneja clicks en celdas para selección de piezas

### Configuración de Tests (vitest.config.ts, vitest.setup.ts)
- **jsdom environment**: Para tests de componentes React
- **globals: true**: Permite usar `expect`, `describe`, `it` sin importar
- **setupFiles**: Importa `@testing-library/jest-dom` para matchers DOM

## Detalles técnicos

### Estructura del componente Piece

```tsx
interface PieceProps {
  color: string;      // Color del jugador (HEX)
  cx: number;         // Coordenada X en el SVG
  cy: number;         // Coordenada Y en el SVG
  r: number;          // Radio de la ficha
  isSelected?: boolean;
  className?: string;
}
```

### Renderizado en capas

1. **Capa inferior**: HexCell (casillero hexagonal)
2. **Capa superior**: Piece (ficha circular)

```tsx
<svg>
  <defs>
    <radialGradient id="pieceGradient">...</radialGradient>
  </defs>
  
  {/* Casillas */}
  {cells.map(cell => <HexCell ... />)}
  
  {/* Fichas */}
  {pieces.map(cell => (
    <Piece
      color={cell.pieceColor}
      cx={cx}
      cy={cy}
      r={radius * 0.85}
      isSelected={isSelected}
    />
  ))}
</svg>
```

### Gradiente radial

El gradiente crea un efecto de brillo en la esquina superior izquierda:

```tsx
<radialGradient id="pieceGradient" cx="30%" cy="30%" r="70%">
  <stop offset="0%" stopColor="white" stopOpacity="0.8" />
  <stop offset="100%" stopColor="white" stopOpacity="0" />
</radialGradient>
```

### Estado seleccionado

Cuando una ficha está seleccionada:
- Borde de 3px dorado (#FFD700)
- Glow amarillo (drop-shadow)
- Transición suave de 0.2s

## Pruebas

Se añadieron tests en `src/components/Piece/Piece.test.tsx` y `src/components/Board/Board.test.tsx`:

1. **Renderiza círculo con color correcto**: Verifica que el círculo se renderiza con el color HEX especificado
2. **Aplica estilo selected**: Verifica que la clase `selected` se aplica cuando `isSelected={true}`
3. **Colores diferentes por jugador**: Verifica que múltiples fichas mantienen sus colores individuales
4. **Renderiza piezas cuando se pasa state**: Verifica que las piezas aparecen con GameState
5. **Renderiza 20 piezas para 2 jugadores**: Valida que cada jugador tiene 10 fichas

## Cómo ejecutar

```bash
cd /home/willypaz/Workspace/projects/WillyProjects/damas-chinas

# Ejecutar tests del componente Piece
pnpm vitest run src/components/Piece/Piece.test.tsx

# Ejecutar todos los tests
pnpm vitest run
```

## Ejemplo de uso

```tsx
import Board from './components/Board/Board';
import { GameEngine } from './engine/game';

// Crear motor y configurar partida
const engine = new GameEngine();
const config = {
  playerCount: 2 as const,
  players: [
    { id: 1, color: '#E74C3C', label: 'Jugador 1', piecesInTarget: 0, pointIndex: 0 },
    { id: 2, color: '#3498DB', label: 'Jugador 2', piecesInTarget: 0, pointIndex: 1 },
  ],
  firstPlayerId: 1 as PlayerId,
};

engine.reset(config);

// Renderizar tablero con estado
<Board 
  size={800} 
  state={engine.getState()}
  onCellClick={(coord) => console.log(coord)}
/>
```

## Colores por jugador

El sistema soporta 6 colores distinguibles para multi-jugador:

| Jugador | Color    | HEX       |
|---------|----------|-----------|
| 1       | Rojo     | #E74C3C   |
| 2       | Azul     | #3498DB   |
| 3       | Verde    | #2ECC71   |
| 4       | Naranja  | #F39C12   |
| 5       | Morado   | #9B59B6   |
| 6       | Turquesa | #1ABC9C   |

## Estado actual
- ✅ HU-B2 completada y verificada
- ✅ Componente Piece renderiza fichas con color dinámico
- ✅ Efecto visual de selección (borde dorado + glow)
- ✅ Gradiente radial para efecto 3D
- ✅ Integrado en Board.tsx con GameState
- ✅ Corrección de coordenadas hex-to-pixel (eje Y invertido)
- ✅ Fichas inicializadas en las 6 puntas de la estrella
- ✅ Tests pasando (7/7 en componentes UI)

## Próximos pasos
- HU-B3: Selección visual de ficha (highlight + valid moves)
- HU-B4: Ejecutar movimiento al clickar destino
- HU-B6: Indicador de turno multi-jugador
