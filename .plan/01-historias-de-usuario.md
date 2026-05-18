# Fase A — Historias de Usuario (Exploración)

**Proyecto:** Juego de Damas Chinas (2 jugadores)  
**Metodología:** Extreme Programming (XP)  
**Equipo:** 4 personas — 2 Parejas de Pair Programming  
**Pareja A (Motor):** Programador 1 + Programador 2 — Lógica de reglas, estado del juego, algoritmos  
**Pareja B (UI/UX):** Programador 3 + Programador 4 — Renderizado, interacción visual, experiencia de usuario  

---

## Pareja A — Motor del Juego (Lógica)

### Historia de Usuario N° 1

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 1</td>
        <td colspan="2">Usuario: Motor del juego</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Estado del tablero
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 5</td>
        <td>Iteración asignada: 1</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como desarrollador del motor, quiero representar el tablero como una estructura de datos con las 121 casillas de la estrella y sus conexiones de adyacencia para que toda la lógica del juego pueda consultar posiciones válidas y movimientos posibles.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Se utiliza un sistema de coordenadas axiales hexagonales (q, r). La estructura debe incluir los vecinos válidos de cada casilla y las posiciones iniciales de ambos jugadores.
        </td>
    </tr>
</table>

### Historia de Usuario N° 2

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 2</td>
        <td colspan="2">Usuario: Motor del juego</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Posicionamiento inicial de fichas
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 3</td>
        <td>Iteración asignada: 1</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero que se coloquen automáticamente 10 fichas mías en la punta superior y las 10 fichas del oponente en la punta inferior al iniciar para que el estado inicial del juego sea correcto y reproducible.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Cada casilla puede contener como máximo 1 ficha. El estado inicial debe ser idéntico en cada nueva partida.
        </td>
    </tr>
</table>

### Historia de Usuario N° 3

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 3</td>
        <td colspan="2">Usuario: Motor del juego</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Movimiento básico (paso adyacente)
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Media</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 5</td>
        <td>Iteración asignada: 2</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero mover una ficha a una casilla vacía adyacente para avanzar paso a paso por el tablero.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Solo fichas del jugador activo pueden moverse. La casilla destino debe ser adyacente y estar vacía. El movimiento actualiza el estado interno del tablero correctamente.
        </td>
    </tr>
</table>

### Historia de Usuario N° 4

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 4</td>
        <td colspan="2">Usuario: Motor del juego</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Movimiento con salto (cadena de saltos)
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Alta</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 8</td>
        <td>Iteración asignada: 3</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero saltar sobre una ficha (propia o del oponente) hacia una casilla vacía contigua y continuar saltando en cadena mientras existan saltos posibles para avanzar rápidamente por el tablero.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Se pueden saltar fichas propias y enemigas. El sistema detecta automáticamente todas las cadenas posibles mediante DFS. La cadena se ejecuta completa en un solo turno.
        </td>
    </tr>
</table>

### Historia de Usuario N° 5

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 5</td>
        <td colspan="2">Usuario: Motor del juego</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Gestión de turnos
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 3</td>
        <td>Iteración asignada: 2</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero que se alternen los turnos entre Jugador 1 y Jugador 2 con el Jugador 1 iniciando siempre para controlar el flujo del juego.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Tras completar un turno (incluyendo cadena de saltos), el turno cambia automáticamente. Se debe poder consultar el turno actual en cualquier momento.
        </td>
    </tr>
</table>

### Historia de Usuario N° 6

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 6</td>
        <td colspan="2">Usuario: Motor del juego</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Validación completa de movimientos
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Media</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 5</td>
        <td>Iteración asignada: 2</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero que se validen todos los intentos de movimiento contra las reglas del juego para garantizar que solo se ejecuten jugadas legales.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Se rechazan: mover fichas del oponente, mover a casilla ocupada, paso a casilla no adyacente, salto con casilla tras la ficha saltada ocupada. Se retorna código de error específico para cada tipo de invalidación.
        </td>
    </tr>
</table>

### Historia de Usuario N° 7

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 7</td>
        <td colspan="2">Usuario: Motor del juego</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Detección de victoria
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 3</td>
        <td>Iteración asignada: 3</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero que se verifique tras cada movimiento si todas las fichas de un jugador llegaron a la punta opuesta para determinar el ganador y finalizar la partida.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Se verifica automáticamente tras cada movimiento completado. Se identifica correctamente al jugador ganador y se notifica al UI cuando se detecta victoria.
        </td>
    </tr>
</table>

### Historia de Usuario N° 8

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 8</td>
        <td colspan="2">Usuario: Motor del juego</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Historial de movimientos
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Media</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 3</td>
        <td>Iteración asignada: 4</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero registrar cada movimiento con turno, origen, destino y tipo para que pueda revisar la secuencia del juego.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Cada movimiento se registra con: número de turno, jugador, casilla origen, casilla destino, tipo (paso o salto). Las cadenas de saltos registran todas las posiciones intermedias.
        </td>
    </tr>
</table>

### Historia de Usuario N° 9

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 9</td>
        <td colspan="2">Usuario: Motor del juego</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Deshacer último movimiento
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Media</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 3</td>
        <td>Iteración asignada: 4</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero deshacer mi último turno completo (incluyendo cadena de saltos) para corregir errores estratégicos.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: El motor restaura el estado del tablero al anterior al último turno y actualiza el historial. No se permite deshacer si es el primer turno o no hay movimientos.
        </td>
    </tr>
</table>

---

## Pareja B — Interfaz de Usuario (UI/UX)

### Historia de Usuario N° 10

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 10</td>
        <td colspan="2">Usuario: Jugador</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Renderizado del tablero
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Media</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 5</td>
        <td>Iteración asignada: 1</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero ver un tablero de Damas Chinas en forma de estrella de David con 121 casillas dibujado en pantalla para visualizar las posiciones disponibles y planificar mis movimientos.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: El tablero se dibuja correctamente como estrella de 6 puntas. Cada casilla se representa visualmente y limita con sus contiguas. El tablero es responsive y se adapta al tamaño de pantalla.
        </td>
    </tr>
</table>

### Historia de Usuario N° 11

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 11</td>
        <td colspan="2">Usuario: Jugador</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Visualización de fichas iniciales
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 3</td>
        <td>Iteración asignada: 1</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero ver las 10 fichas de cada jugador colocadas en la punta correspondiente al iniciar para saber la configuración inicial de cada jugador.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Las fichas del Jugador 1 se renderizan con color rojo/tono cálido. Las fichas del Jugador 2 se renderizan con color azul/tono frío. Cada ficha se distingue claramente por color y forma.
        </td>
    </tr>
</table>

### Historia de Usuario N° 12

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 12</td>
        <td colspan="2">Usuario: Jugador</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Selección visual de ficha
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Media</td>
        <td>Riesgo: Media</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 5</td>
        <td>Iteración asignada: 2</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero seleccionar una ficha propia tocando sobre ella y ver resaltadas las casillas válidas de movimiento para saber qué movimientos puedo realizar.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Al hacer clic en una ficha propia se resalta con un borde/brillo. Se muestran con indicador visual (círculo verde) las casillas adyacentes vacías posibles y con otro indicador (cruz naranja) las casillas alcanzables por salto. Al deseleccionar se limpian los resaltados.
        </td>
    </tr>
</table>

### Historia de Usuario N° 13

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 13</td>
        <td colspan="2">Usuario: Jugador</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Reinicio de juego sin recargar
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Media</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 2</td>
        <td>Iteración asignada: 2</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero reiniciar la partida desde un botón en la interfaz sin recargar la página para poder jugar varias partidas consecutivas rápidamente.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: El botón "Nuevo Juego" restaura las posiciones iniciales visuales. El indicador de turno vuelve al Jugador 1. Se limpia cualquier estado de selección visual previa. La transición es suave sin parpadeo de pantalla.
        </td>
    </tr>
</table>

### Historia de Usuario N° 14

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 14</td>
        <td colspan="2">Usuario: Jugador</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Animación de movimientos
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Baja</td>
        <td>Riesgo: Media</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 5</td>
        <td>Iteración asignada: 3</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero ver animaciones suaves cuando las fichas se mueven por el tablero para entender visualmente la secuencia de jugadas y disfrutar una experiencia fluida.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Las fichas se deslizan suavemente desde origen hasta destino (~300ms). En cadenas de saltos, cada salto individual se anima secuencialmente. Se puede desactivar o acelerar la velocidad en configuración.
        </td>
    </tr>
</table>

### Historia de Usuario N° 15

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 15</td>
        <td colspan="2">Usuario: Jugador</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Indicador de turno y estado del juego
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Media</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 3</td>
        <td>Iteración asignada: 3</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero ver un panel informativo que indique de quién es el turno y cuántas fichas ha movido cada uno para tener información clara durante la partida.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Se muestra claramente "Turno: Jugador 1 (Rojo)" o "Jugador 2 (Azul)". Se cuenta y muestra cuántas fichas de cada jugador están en su zona objetivo. La información se actualiza en tiempo real tras cada movimiento.
        </td>
    </tr>
</table>

### Historia de Usuario N° 16

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 16</td>
        <td colspan="2">Usuario: Jugador</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Pantalla de victoria
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Baja</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 3</td>
        <td>Iteración asignada: 4</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero ver una pantalla o modal que anuncie al ganador con efecto visual festivo para saber claramente cuándo terminó la partida.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Al detectar victoria se muestra un overlay/modal sobre el tablero. El mensaje indica "¡Jugador X (Color) gana!" e incluye un botón para reiniciar directamente. La animación de entrada es elegante (fade-in + slide-up).
        </td>
    </tr>
</table>

### Historia de Usuario N° 17

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 17</td>
        <td colspan="2">Usuario: Jugador</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Historial visual de movimientos
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Baja</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 3</td>
        <td>Iteración asignada: 4</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero ver un panel lateral con el registro visual de los movimientos realizados para revisar la secuencia del juego y entender la estrategia empleada.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Cada movimiento se lista con: turno, "Jugador X: casilla A → casilla B (tipo)". Los saltos en cadena se muestran como "Jugador X: A → ... → Z [cadena]". Se resalta el último movimiento y hace scroll automático.
        </td>
    </tr>
</table>

### Historia de Usuario N° 18

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 18</td>
        <td colspan="2">Usuario: Usuario final</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Diseño visual general y pulido
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Baja</td>
        <td>Riesgo: Baja</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 5</td>
        <td>Iteración asignada: 4</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como usuario final, quiero disfrutar de una interfaz visual atractiva con paleta de colores coherente, tipografía legible y efectos hover/focus en elementos interactivos para disfrutar de una experiencia de juego agradable y profesional.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: Paleta de colores definida y consistente. Tipografía legible y tamaños apropiados. Efectos hover en casillas y fichas. Diseño responsive que funcione en escritorio y tablet. Layout centrado y equilibrado con espaciado adecuado.
        </td>
    </tr>
        </table>

### Historia de Usuario N° 19

<table border="1">
    <tr>
        <td colspan="3" style="text-align: end;">Historia de usuario</td>
    </tr>
    <tr>
        <td>Número: 19</td>
        <td colspan="2">Usuario: Jugador</td>
    </tr>
    <tr>
        <td colspan="3">
            Nombre Historia: Pantalla de configuración de jugadores
        </td>
    </tr>
    <tr>
        <td colspan="2">Prioridad: Alta</td>
        <td>Riesgo: Media</td>
    </tr>
    <tr>
        <td colspan="2">Puntos estimados: 5</td>
        <td>Iteración asignada: 1</td>
    </tr>
    <tr>
        <td colspan="3">
            Programador responsable:
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Descripción: Como jugador, quiero seleccionar la cantidad de jugadores (2 a 6) y asignar cada jugador a una punta diferente del tablero antes de comenzar, para personalizar la configuración inicial de cada partida.
        </td>
    </tr>
    <tr>
        <td colspan="3">
            Observaciones: El selector muestra un mini-tablero SVG con las 6 puntas destacadas y etiquetadas (Norte, Noreste, Sudeste, Sur, Suroeste, Noroeste). Al elegir la cantidad de jugadores (2-6), se habilitan exactamente esa cantidad de puntas para seleccionar. Cada clic en una punta asigna el siguiente jugador no asignado. Se generan colores automáticamente distinguibles para cada jugador. Se valida mínimo 2 puntas seleccionadas. El botón "Jugar" envía la config al motor del juego.
        </td>
    </tr>
</table>

---

## Resumen de Historias de Usuario

### Pareja A — Motor del Juego (Lógica)

<table border="1">
    <tr>
        <th>N°</th>
        <th>Historia</th>
        <th>Prioridad</th>
        <th>Riesgo</th>
        <th>Puntos</th>
        <th>Iteración</th>
    </tr>
    <tr><td>1</td><td>Estado del tablero</td><td>Alta</td><td>Baja</td><td>5</td><td>1</td></tr>
    <tr><td>2</td><td>Posicionamiento inicial (multi-jugador)</td><td>Alta</td><td>Baja</td><td>5</td><td>1</td></tr>
    <tr><td>3</td><td>Movimiento básico (paso adyacente)</td><td>Alta</td><td>Media</td><td>5</td><td>2</td></tr>
    <tr><td>4</td><td>Movimiento con salto (cadena)</td><td>Alta</td><td>Alta</td><td>8</td><td>3</td></tr>
    <tr><td>5</td><td>Gestión de turnos (multi-jugador)</td><td>Alta</td><td>Baja</td><td>3</td><td>2</td></tr>
    <tr><td>6</td><td>Validación completa de movimientos</td><td>Alta</td><td>Media</td><td>5</td><td>2</td></tr>
    <tr><td>7</td><td>Detección de victoria (individual)</td><td>Alta</td><td>Baja</td><td>3</td><td>3</td></tr>
    <tr><td>8</td><td>Historial de movimientos</td><td>Media</td><td>Baja</td><td>3</td><td>4</td></tr>
    <tr><td>9</td><td>Deshacer último movimiento</td><td>Media</td><td>Baja</td><td>3</td><td>4</td></tr>
    <tr><td colspan="4" style="text-align: right;"><b>Subtotal Pareja A</b></td><td><b>40 pts</b></td><td></td></tr>
</table>

### Pareja B — Interfaz de Usuario (UI/UX)

<table border="1">
    <tr>
        <th>N°</th>
        <th>Historia</th>
        <th>Prioridad</th>
        <th>Riesgo</th>
        <th>Puntos</th>
        <th>Iteración</th>
    </tr>
    <tr><td>10</td><td>Renderizado del tablero</td><td>Alta</td><td>Media</td><td>5</td><td>1</td></tr>
    <tr><td>11</td><td>Visualización de fichas iniciales</td><td>Alta</td><td>Baja</td><td>3</td><td>1</td></tr>
    <tr><td>12</td><td>Selección visual de ficha</td><td>Media</td><td>Media</td><td>5</td><td>2</td></tr>
    <tr><td>13</td><td>Reinicio de juego sin recargar</td><td>Media</td><td>Baja</td><td>2</td><td>2</td></tr>
    <tr><td>14</td><td>Animación de movimientos</td><td>Baja</td><td>Media</td><td>5</td><td>3</td></tr>
    <tr><td>15</td><td>Indicador de turno (multi-jugador)</td><td>Media</td><td>Baja</td><td>3</td><td>2</td></tr>
    <tr><td>16</td><td>Pantalla de victoria</td><td>Baja</td><td>Baja</td><td>3</td><td>4</td></tr>
    <tr><td>17</td><td>Historial visual de movimientos</td><td>Baja</td><td>Baja</td><td>3</td><td>4</td></tr>
    <tr><td>18</td><td>Diseño visual general y pulido</td><td>Baja</td><td>Baja</td><td>5</td><td>4</td></tr>
    <tr><td>19</td><td>Pantalla de configuración de jugadores</td><td>Alta</td><td>Media</td><td>5</td><td>1</td></tr>
    <tr><td colspan="4" style="text-align: right;"><b>Subtotal Pareja B</b></td><td><b>39 pts</b></td><td></td></tr>
</table>

### Resumen General

<table border="1">
    <tr>
        <th></th>
        <th>Historias</th>
        <th>Puntos XP</th>
    </tr>
    <tr><td><b>Pareja A (Motor)</b></td><td>9 historias</td><td>40 pts</td></tr>
    <tr><td><b>Pareja B (UI/UX)</b></td><td>10 historias</td><td>39 pts</td></tr>
    <tr><td colspan="2" style="text-align: right;"><b>Total</b></td><td><b>79 pts</b></td></tr>
</table>

### Distribución por Iteración

<table border="1">
    <tr>
        <th>Iteración</th>
        <th>Historias asignadas</th>
        <th>Puntos XP</th>
        <th>Responsable principal</th>
    </tr>
    <tr><td>Sprint 1</td><td>HU-1, HU-2, HU-10, HU-11, HU-19</td><td>26 pts</td><td>Pareja A + Pareja B</td></tr>
    <tr><td>Sprint 2</td><td>HU-3, HU-5, HU-6, HU-12, HU-13, HU-15</td><td>23 pts</td><td>Pareja A + Pareja B</td></tr>
    <tr><td>Sprint 3</td><td>HU-4, HU-7, HU-14</td><td>16 pts</td><td>Pareja A + Pareja B</td></tr>
    <tr><td>Sprint 4</td><td>HU-8, HU-9, HU-16, HU-17, HU-18</td><td>17 pts</td><td>Pareja A + Pareja B</td></tr>
    <tr><td>Sprint 5</td><td>Integración, pruebas y demo</td><td>8 pts</td><td>Ambas parejas</td></tr>
</table>
