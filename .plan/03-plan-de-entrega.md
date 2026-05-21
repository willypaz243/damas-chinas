# Plan de Entrega — Damas Chinas XP

**Metodología:** Extreme Programming (XP)  
**Equipo:** [Nombres del equipo]  
**Fecha límite:** Lunes 25 de mayo, 14:00  
**Entrega:** Un miembro del equipo envía la documentación completa  

---

## Estructura de Entrega

```
damas-chinas-documentacion/
├── docs/
│   ├── HistoriasDeUsuario.md              ← Fase A (Exploración)
│   ├── Planificacion.md                    ← Fase B (Planificación)
│   ├── Retrospectiva-Iteracion1.md         ← Iteración 1 (Clase 1)
│   ├── Retrospectiva-Iteracion2.md         ← Iteración 2 (Clase 2)
│   ├── Retrospectiva-Iteracion3.md         ← Iteración 3 (Independiente)
│   ├── Retrospectiva-Iteracion4.md         ← Iteración 4 (Independiente)
│   └── README-entrega.md                   ← Índice + explicación general
├── src/                                    ← Código completo funcionando
├── package.json
└── README.md
```

---

## Contenido de Cada Retrospectiva

Cada archivo `Retrospectiva-IteracionX.md` debe incluir:

### 1. Información General
- Número de iteración y duración
- Miembros del equipo y roles (driver/navigator por pareja)

### 2. Historias Trabajadas
- Lista de historias de usuario incluidas en esta iteración
- Puntos XP estimados vs reales
- Planning poker: votos de cada miembro y resultado final

### 3. Tareas Ejecutadas

#### Pareja A (Motor)
| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| ... | ... | ✅/❌ | ... |

#### Pareja B (UI/UX)
| # | Tarea | Estado | Tiempo real |
|---|-------|--------|-------------|
| ... | ... | ✅/❌ | ... |

### 4. Código Generado
- Archivos creados/modificados por pareja
- Snippets de código relevantes (solo los más importantes)
- Tests escritos

### 5. Demostración
- Captura de pantalla del resultado de la iteración
- Descripción de qué funcionalidades están funcionando
- Problemas encontrados durante la demo

### 6. Prácticas XP Aplicadas
| Práctica | ¿Se aplicó? | Comentario |
|----------|-------------|------------|
| Planning Poker | Sí/No | ... |
| Pair Programming | Sí/No | Quién fue driver, quién navigator |
| TDD | Sí/No | Tests antes de código |
| Simple Design | Sí/No | Justificación |
| Refactoring | Sí/No | Qué se refactorizó |
| Testing continuo | Sí/No | Tests pasando |
| Integración | Sí/No | Resultado |
| Demo | Sí/No | Qué se mostró |

### 7. Retrospectiva

**Qué salió bien:**
- ...

**Qué mejorar:**
- ...

**Acciones para la próxima iteración:**
- ...

---

## Cronograma de Trabajo

### Antes de Clase (Iteración 0 — Exploración + Planificación)
| Actividad | Duración | Responsable |
|-----------|----------|-------------|
| Elaborar Historias de Usuario (10 HU) | 30 min | Equipo completo |
| Definir contrato de integración (`types.ts`) | 15 min | Pareja A + Pareja B |
| Planificación: priorización, puntos XP, tareas | 30 min | Equipo completo |
| **Entregable:** `HistoriasDeUsuario.md` + `Planificacion.md` | | |

### Clase 1 — Iteración 1 (40 min)
| Tiempo | Actividad | Responsable |
|--------|-----------|-------------|
| 0-5 min | Planning Poker + Standup | Equipo completo |
| 5-10 min | Formar parejas (driver/navigator) | Parejas A y B |
| 10-30 min | Pair Programming + TDD | Ambas parejas |
| 30-35 min | Integración: unir tablero + fichas | Pareja B |
| 35-40 min | Demo + Retro | Equipo completo |
| **Entregable:** `Retrospectiva-Iteracion1.md` + código iteración 1 | | |

### Clase 2 — Iteración 2 (40 min)
| Tiempo | Actividad | Responsable |
|--------|-----------|-------------|
| 0-3 min | Standup: qué hicimos en Iteración 1 | Equipo completo |
| 3-8 min | Planning Poker + Pairing | Parejas A y B |
| 8-28 min | Pair Programming + TDD | Ambas parejas |
| 28-35 min | Integración: flujo completo jugable | Pareja B |
| 35-40 min | Demo + Retro | Equipo completo |
| **Entregable:** `Retrospectiva-Iteracion2.md` + código iteración 2 | | |

### Trabajo Independiente — Iteración 3 (1.5-2 horas)
| Actividad | Duración | Responsable |
|-----------|----------|-------------|
| Implementar saltos en cadena (DFS) | 45 min | Pareja A |
| Tests Vitest para saltos | 30 min | Pareja A |
| Implementar detección de victoria | 20 min | Pareja A |
| Crear VictoryModal | 20 min | Pareja B |
| Integración y pruebas | 20 min | Pareja B |
| Escribir retrospectiva | 15 min | Equipo |

### Trabajo Independiente — Iteración 4 (1-1.5 horas)
| Actividad | Duración | Responsable |
|-----------|----------|-------------|
| Botón reiniciar + conectar engine.reset() | 20 min | Pareja B |
| Implementar deshacer (snapshot stack) | 30 min | Pareja A |
| Tests Vitest para undo | 15 min | Pareja A |
| Botón deshacer en UI | 15 min | Pareja B |
| Pulido visual final | 20 min | Pareja B |
| Integración y pruebas | 20 min | Pareja B |
| Escribir retrospectiva | 15 min | Equipo |

### Antes del 25 de mayo, ANTES de las 14:00
| Actividad | Duración | Responsable |
|-----------|----------|-------------|
| Empaquetar toda la documentación | 30 min | Miembro designado |
| Verificar que `pnpm build` pasa | 10 min | Pareja A |
| Verificar estructura de entrega | 10 min | Equipo completo |
| **ENVIAR DOCUMENTACIÓN** | | Miembro designado |

---

## Checklist de Entrega

- [ ] `docs/HistoriasDeUsuario.md` — 10 HU con criterios de aceptación
- [ ] `docs/Planificacion.md` — Priorización, puntos XP, tareas, contrato
- [ ] `docs/Retrospectiva-Iteracion1.md` — Con todas las secciones requeridas
- [ ] `docs/Retrospectiva-Iteracion2.md` — Con todas las secciones requeridas
- [ ] `docs/Retrospectiva-Iteracion3.md` — Con todas las secciones requeridas
- [ ] `docs/Retrospectiva-Iteracion4.md` — Con todas las secciones requeridas
- [ ] `docs/README-entrega.md` — Índice + explicación general del proyecto
- [ ] Código funcionando: `pnpm build` sin errores
- [ ] Tests pasando: `pnpm test` sin fallos
- [ ] Todos los nombres del equipo en el README de entrega
- [ ] Enviado ANTES del lunes 25, 14:00

---

## Guía README-entrega.md

El archivo `docs/README-entrega.md` debe contener:

```markdown
# Damas Chinas — Documentación XP

## Equipo
- [Nombre 1] — [Rol: Pareja A/B]
- [Nombre 2] — [Rol: Pareja A/B]
- [Nombre 3] — [Rol: Pareja A/B]
- [Nombre 4] — [Rol: Pareja A/B]

## Resumen del Proyecto
Breve descripción del juego y las funcionalidades implementadas.

## Fases XP Aplicadas

### Exploración (Iteración 0)
- Se elaboraron 10 historias de usuario
- Se definieron criterios de aceptación para cada HU
- Se realizó planning poker para estimar puntos XP
- Ver: [HistoriasDeUsuario.md](HistoriasDeUsuario.md)
- Ver: [Planificacion.md](Planificacion.md)

### Planificación
- Se priorizaron las historias por valor del MVP
- Velocidad estimada: 8-10 pts XP por sesión de 40 min
- Se definieron tareas de ingeniería para cada HU
- Contrato de integración: `types.ts` compartido

### Iteración 1 — Tablero + Fichas Iniciales
- Historias: HU-1 (tablero), HU-2 (fichas)
- Resultado: Tablero SVG con 20 fichas estáticas
- Ver: [Retrospectiva-Iteracion1.md](Retrospectiva-Iteracion1.md)

### Iteración 2 — Juego Jugable (MVP)
- Historias: HU-3,4,5 (seleccionar, mover, turno), HU-8 (indicador)
- Resultado: 🎮 Se puede seleccionar ficha, ver movimientos válidos, mover y cambiar turno
- Ver: [Retrospectiva-Iteracion2.md](Retrospectiva-Iteracion2.md)

### Iteración 3 — Saltos + Victoria
- Historias: HU-6 (saltos en cadena), HU-7 (victoria)
- Resultado: Saltos DFS + modal de victoria
- Ver: [Retrospectiva-Iteracion3.md](Retrospectiva-Iteracion3.md)

### Iteración 4 — Pulido
- Historias: HU-9 (reiniciar), HU-10 (deshacer)
- Resultado: Botones nuevo juego y deshacer
- Ver: [Retrospectiva-Iteracion4.md](Retrospectiva-Iteracion4.md)

## Prácticas XP Aplicadas
- Planning Poker en cada iteración
- Pair Programming (Pareja A + Pareja B)
- TDD (tests antes de código)
- Simple Design (empezar mínimo, refinar después)
- Refactoring continuo
- Testing continuo con Vitest
- Integración frecuente al final de cada iteración
- Demo y Retrospectiva en cada iteración

## Cómo Ejecutar el Proyecto
```bash
pnpm install
pnpm dev       # servidor de desarrollo
pnpm build     # build de producción
pnpm test      # ejecutar tests
```

## Capturas del Juego
[Incluir capturas de pantalla del juego funcionando en cada iteración]
```
