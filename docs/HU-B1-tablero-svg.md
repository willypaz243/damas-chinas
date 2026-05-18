# HU-B1 — Renderizado del tablero SVG

## Objetivo
Implementar la base de la UI para renderizar el tablero de Damas Chinas como una cuadrícula hexagonal SVG en React.

## Archivos modificados
- `src/components/Board/Board.tsx`
- `src/components/Board/HexCell.tsx`
- `src/components/Board/Board.test.tsx`
- `src/styles/Board.module.css`
- `src/App.tsx`
- `package.json`

## Qué se implementó
- Componente `<Board />` que renderiza un tablero completo dentro de un elemento `<svg>`.
- Conversión de coordenadas axiales `q,r` a posiciones de píxel con la fórmula de hexágonos axiales.
- Componente `<HexCell />` que dibuja una celda hexagonal con un elemento `<polygon>` SVG.
- Estilos CSS básicos para el tablero y el comportamiento hover de las celdas.
- Integración del tablero en `src/App.tsx` para que se muestre en la aplicación principal.
- Dependencia `jsdom` añadida a `devDependencies` para soportar pruebas de componentes React con Vitest.

## Detalles técnicos
- El tablero se renderiza en un lienzo SVG de tamaño `800x800` por defecto.
- Cada hexágono tiene un radio fijo de `22` píxeles.
- El origen del tablero se coloca en el centro del SVG para mantener la estrella centrada.
- Se crea un `HexBoard` del motor para generar la lista de celdas válidas y renderizarlas dinámicamente.

## Pruebas
Se añadió `src/components/Board/Board.test.tsx` con pruebas unitarias para:
- verificar que se renderiza un `<svg>` con `121` celdas hexagonales
- verificar que el callback `onCellClick` se dispara al hacer click en una celda

## Cómo ejecutar
```bash
cd /home/willypaz/Workspace/projects/WillyProjects/damas-chinas
./node_modules/.bin/vitest run src/components/Board/Board.test.tsx
```

## Estado actual
- HU-B1 implementada.
- El tablero SVG está visible y la estructura base ya puede usarse para los siguientes pasos de interacción y selección.
