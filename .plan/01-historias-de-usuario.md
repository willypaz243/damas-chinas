# Fase A — Historias de Usuario (Exploración)

**Proyecto:** Juego de Damas Chinas (2 jugadores)  
**Metodología:** Extreme Programming (XP)  
**Equipo:** 4 personas — 2 Parejas de Pair Programming  
**Pareja A (Motor):** Programador 1 + Programador 2 — Lógica de reglas, estado del juego  
**Pareja B (UI/UX):** Programador 3 + Programador 4 — Renderizado, interacción visual  

---

## Historias de Usuario

### Historia de Usuario N° 1

| Campo | Valor |
|-------|-------|
| **Número:** | 1 |
| **Usuario:** | Jugador |
| **Nombre:** | Ver tablero renderizado |
| **Prioridad:** | Alta |
| **Riesgo:** | Baja |
| **Puntos XP:** | 3 |
| **Iteración:** | 1 |

**Descripción:** Como jugador, quiero ver un tablero de Damas Chinas en forma de estrella de David renderizado en pantalla para visualizar las posiciones disponibles.

**Criterios de Aceptación:**
- [ ] El tablero se muestra como SVG con la forma de estrella de 6 puntas
- [ ] Se renderizan todas las casillas visibles del tablero (121 casillas)
- [ ] El tablero es responsive y se adapta al tamaño de pantalla
- [ ] Al ejecutar `npm run dev` se ve el tablero en el navegador

---

### Historia de Usuario N° 2

| Campo | Valor |
|-------|-------|
| **Número:** | 2 |
| **Usuario:** | Jugador |
| **Nombre:** | Fichas iniciales colocadas |
| **Prioridad:** | Alta |
| **Riesgo:** | Baja |
| **Puntos XP:** | 2 |
| **Iteración:** | 1 |

**Descripción:** Como jugador, quiero que se coloquen automáticamente 10 fichas de cada jugador en sus puntas correspondientes al iniciar para ver la configuración inicial correcta.

**Criterios de Aceptación:**
- [ ] 10 fichas del Jugador 1 (rojas) en la punta inferior
- [ ] 10 fichas del Jugador 2 (azules) en la punta superior
- [ ] Las fichas se muestran como círculos con color diferenciado
- [ ] El estado inicial es idéntico en cada recarga

---

### Historia de Usuario N° 3

| Campo | Valor |
|-------|-------|
| **Número:** | 3 |
| **Usuario:** | Jugador |
| **Nombre:** | Seleccionar ficha y ver movimientos válidos |
| **Prioridad:** | Alta |
| **Riesgo:** | Media |
| **Puntos XP:** | 5 |
| **Iteración:** | 2 |

**Descripción:** Como jugador, quiero seleccionar una ficha propia tocando sobre ella y ver resaltadas las casillas válidas de movimiento para saber qué movimientos puedo realizar.

**Criterios de Aceptación:**
- [ ] Al hacer clic en una ficha propia se resalta con un borde brillante
- [ ] Se muestran con indicador visual (círculo verde) las casillas adyacentes vacías posibles
- [ ] Se muestran con otro indicador (círculo naranja) las casillas alcanzables por salto
- [ ] Al hacer clic fuera o en otra ficha, se limpia la selección
- [ ] Solo se pueden seleccionar fichas del jugador cuyo turno es

---

### Historia de Usuario N° 4

| Campo | Valor |
|-------|-------|
| **Número:** | 4 |
| **Usuario:** | Jugador |
| **Nombre:** | Mover ficha a casilla válida |
| **Prioridad:** | Alta |
| **Riesgo:** | Media |
| **Puntos XP:** | 3 |
| **Iteración:** | 2 |

**Descripción:** Como jugador, quiero mover mi ficha seleccionada a una casilla válida clickeando sobre ella para avanzar en el juego.

**Criterios de Aceptación:**
- [ ] Al hacer clic en una casilla válida resaltada, la ficha se mueve allí
- [ ] La casilla de origen se vacía y la de destino ocupa la ficha
- [ ] La selección se limpia tras el movimiento
- [ ] Solo se pueden mover fichas propias (validación por turno)
- [ ] El movimiento se actualiza visualmente en el tablero

---

### Historia de Usuario N° 5

| Campo | Valor |
|-------|-------|
| **Número:** | 5 |
| **Usuario:** | Jugador |
| **Nombre:** | Cambio de turno automático |
| **Prioridad:** | Alta |
| **Riesgo:** | Baja |
| **Puntos XP:** | 2 |
| **Iteración:** | 2 |

**Descripción:** Como jugador, quiero que el turno cambie automáticamente tras cada movimiento para saber de quién es la siguiente jugada.

**Criterios de Aceptación:**
- [ ] El turno cambia de Jugador 1 a Jugador 2 tras cada movimiento
- [ ] El indicador visual de turno se actualiza inmediatamente
- [ ] Solo el jugador activo puede mover sus fichas
- [ ] El cambio es automático, no requiere acción del usuario

---

### Historia de Usuario N° 6

| Campo | Valor |
|-------|-------|
| **Número:** | 6 |
| **Usuario:** | Jugador |
| **Nombre:** | Saltar fichas en cadena |
| **Prioridad:** | Alta |
| **Riesgo:** | Alta |
| **Puntos XP:** | 8 |
| **Iteración:** | 3 |

**Descripción:** Como jugador, quiero saltar sobre fichas (propias o del oponente) hacia casillas vacías y continuar saltando en cadena mientras existan saltos posibles para avanzar rápidamente.

**Criterios de Aceptación:**
- [ ] Se detectan saltos individuales (saltar sobre ficha adyacente a casilla vacía)
- [ ] Se encuentran todas las cadenas de saltos posibles mediante DFS
- [ ] La cadena se ejecuta completa en un solo turno
- [ ] Las fichas saltadas permanecen en el tablero (no se comen)
- [ ] Se muestran visualmente las casillas alcanzables por salto

---

### Historia de Usuario N° 7

| Campo | Valor |
|-------|-------|
| **Número:** | 7 |
| **Usuario:** | Jugador |
| **Nombre:** | Detección de victoria |
| **Prioridad:** | Media |
| **Riesgo:** | Baja |
| **Puntos XP:** | 3 |
| **Iteración:** | 3 |

**Descripción:** Como jugador, quiero que se verifique si todas mis fichas llegaron a la punta opuesta para saber cuándo gano.

**Criterios de Aceptación:**
- [ ] Se verifica tras cada movimiento si un jugador completó su zona objetivo
- [ ] Si 10 fichas del mismo jugador están en la punta opuesta, ese jugador gana
- [ ] Se muestra un modal/pantalla anunciando al ganador
- [ ] El modal incluye botón para reiniciar la partida

---

### Historia de Usuario N° 8

| Campo | Valor |
|-------|-------|
| **Número:** | 8 |
| **Usuario:** | Jugador |
| **Nombre:** | Indicador de turno visible |
| **Prioridad:** | Media |
| **Riesgo:** | Baja |
| **Puntos XP:** | 2 |
| **Iteración:** | 2 |

**Descripción:** Como jugador, quiero ver claramente de quién es el turno actual con un indicador visual para saber quién debe jugar.

**Criterios de Aceptación:**
- [ ] Se muestra "Turno: Jugador X" con el color del jugador activo
- [ ] El indicador se actualiza tras cada movimiento
- [ ] Es visualmente claro y distinguible

---

### Historia de Usuario N° 9

| Campo | Valor |
|-------|-------|
| **Número:** | 9 |
| **Usuario:** | Jugador |
| **Nombre:** | Botón reiniciar juego |
| **Prioridad:** | Baja |
| **Riesgo:** | Baja |
| **Puntos XP:** | 2 |
| **Iteración:** | 4 |

**Descripción:** Como jugador, quiero un botón para reiniciar la partida sin recargar la página para jugar varias veces rápidamente.

**Criterios de Aceptación:**
- [ ] Botón "Nuevo Juego" visible en la interfaz
- [ ] Al hacer clic, las fichas vuelven a sus posiciones iniciales
- [ ] El turno vuelve al Jugador 1
- [ ] Se limpia cualquier estado de selección previa
- [ ] No requiere recargar la página

---

### Historia de Usuario N° 10

| Campo | Valor |
|-------|-------|
| **Número:** | 10 |
| **Usuario:** | Jugador |
| **Nombre:** | Deshacer último movimiento |
| **Prioridad:** | Baja |
| **Riesgo:** | Baja |
| **Puntos XP:** | 3 |
| **Iteración:** | 4 |

**Descripción:** Como jugador, quiero deshacer mi último movimiento para corregir errores estratégicos.

**Criterios de Aceptación:**
- [ ] Botón "Deshacer" visible en la interfaz
- [ ] Al hacer clic, el tablero vuelve al estado anterior
- [ ] El turno vuelve al jugador que hizo el movimiento
- [ ] No se puede deshacer si es el primer movimiento
- [ ] La selección de ficha se limpia al deshacer

---

## Resumen

| # | Historia | Prioridad | Puntos XP | Iteración |
|---|----------|-----------|-----------|-----------|
| 1 | Ver tablero renderizado | Alta | 3 | 1 |
| 2 | Fichas iniciales colocadas | Alta | 2 | 1 |
| 3 | Seleccionar ficha + ver movimientos | Alta | 5 | 2 |
| 4 | Mover ficha a casilla válida | Alta | 3 | 2 |
| 5 | Cambio de turno automático | Alta | 2 | 2 |
| 6 | Saltar fichas en cadena | Alta | 8 | 3 |
| 7 | Detección de victoria | Media | 3 | 3 |
| 8 | Indicador de turno visible | Media | 2 | 2 |
| 9 | Botón reiniciar juego | Baja | 2 | 4 |
| 10 | Deshacer último movimiento | Baja | 3 | 4 |
| | **Total** | | **30 pts** | |

### Distribución por Iteración

| Iteración | Historias | Puntos XP | Resultado Esperado |
|-----------|-----------|-----------|-------------------|
| **Iteración 1** | HU-1, HU-2 | 5 pts | Tablero SVG + fichas estáticas |
| **Iteración 2** | HU-3, HU-4, HU-5, HU-8 | 12 pts | 🎮 Juego jugable (seleccionar → mover → turno) |
| **Iteración 3** | HU-6, HU-7 | 11 pts | Saltos en cadena + detección de victoria |
| **Iteración 4** | HU-9, HU-10 | 5 pts | Reiniciar + deshacer |
