# PRÁCTICA DE SISTEMAS DE INFORMACIÓN II
## XP – Grupos 1 al 5

### Caso de Estudio: Juego de damas china

Las damas chinas es un juego de mesa de estrategia de origen alemán para dos a seis jugadores. 

El objetivo es ser el primero en mover todas las canicas hacia la esquina opuesto a la posición inicial, utilizando movimientos de un solo paso o movimientos que saltan sobre otras piezas. Si el juego es de más de dos jugadores, continúan el juego para establecer finalistas de su respectivo lugar.

Se juega en un tablero con 121 casillas en forma de estrella de David, (de seis puntas). Cada una de estas casillas limita con las seis contiguas (salvo las situadas en los bordes del tablero, que limitan con dos, cuatro o cinco). Cada juego, equipo o color consta de diez fichas o piezas. Al empezar el juego, estas diez fichas de un mismo jugador están juntas, en uno de los triángulos que forman las puntas de la estrella. Cada juego de diez piezas tiene un color diferente o una característica que las distinga de las de otro jugador. Generalmente, las 121 posiciones del tablero tienen forma de agujeros en los que se encajan las piezas. Este diseño ayuda a dejar clara la regla de sólo puede haber una pieza por casilla.

El objetivo del juego es llevar desde una punta hasta el triángulo opuesto. Por ejemplo, el dibujo ASCII siguiente muestra una disposición inicial del juego para seis participantes, A, B y R. R debe mover sus fichas desde las casillas marcadas con la letra `R` hasta las que tienen la letra `V`; N debe mover las suyas desde las señaladas con `N` hasta las marcadas con `A`; B hasta las `C`; V de `V` a `R`, etc.

```text
            R            
           R R           
          R R R          
         R R R R         
N N N N O O O O O C C C C 
 N N N O O O O O O C C C 
   N N O O O O O O O C C   
     N O O O O O O O O C   
     O O O O O O O O O    
    B O O O O O O O O A   
   B B O O O O O O O A A  
  B B B O O O O O O A A A 
B B B B O O O O O A A A A
         V V V V         
          V V V          
           V V           
            V            
```

### Movimientos permitidos
Como en el clásico juego de las damas, cada jugador:
- Puede mover una ficha a una posición adyacente vacía, si está libre.
- O puede saltar una casilla adyacente ocupada por otra ficha (sea propia o sea de un contrario) y posándola en la casilla siguiente (en la misma dirección), si está libre.

Si el movimiento es de este segundo tipo (un salto), y conduce la ficha a una casilla contigua a otra ocupada, puede seguir moviendo la pieza con la que empezó. Así, en un solo turno, una ficha puede avanzar de una punta del tablero a otra si la situación es propicia.

A diferencia de las damas, no se comen piezas (las fichas sobre las que se ha saltado no se retiran del juego).

### Variantes según número de jugadores
Las estrategias que conviene emplear dependen de la distribución inicial de las fichas, y esta depende del número de jugadores. No se puede usar un espacio el cual no sea tu objetivo final.

- **Con seis jugadores**: Cada participante empieza con sus diez fichas en una de las puntas y su meta es la punta opuesta. Si hay una ficha del oponente que se encuentra en tu meta, tiene que quitarla ya que impide que el oponente termine el juego.
- **Con cinco jugadores**: Una de las esquinas está libre desde el principio, lo que da ventaja al que empieza en la opuesta. Se suele dejar esta posición para el jugador más débil (un principiante o un niño).
- **Con cuatro jugadores**: Se dejan libres dos esquinas para que los cuatro jugadores compitan en igualdad de condiciones, las cuales estando en sus casillas no pueden comer o quitar ficha, la parte del centro es libre las esquinas no. 
- **Con tres jugadores**: Cada participante puede manejar uno o dos juegos de fichas:
  - Con uno, debe mover sus fichas hasta una esquina vacía.
  - Con dos, debe mover cada uno de sus colores hacia la esquina donde tiene su otro juego.
- **Con dos jugadores**: Cada participante maneja una esquina contraria de tal manera de que en el juego haya igualdad en los jugadores hasta que un jugador llegue al otro lado.

En principio, solo se sugiere implementar el juego para 2 jugadores. 

---

### TRABAJO PRÁCTICO (20 puntos)
a) Elaborar mínimo 10 Historias de Usuario (exploración)
b) Planificar la entrega, número de iteraciones, determinando prioridades y esfuerzo de cada historia de usuario (planificación). 
c) Elaborar las tareas de ingeniería para cada historia de usuario (planning)
d) Programar las tareas de ingeniería (iteración)
e) Hacer las pruebas y demostración del incremento (producción)

Después de terminar la práctica, se debe presentar un documento con la exploración (lista de historias usuario), planificación (historias de usuario, tareas de ingeniería, planificación), explicación de lo realizado en cada iteración (iteración), la demostración y la retrospectiva.
```