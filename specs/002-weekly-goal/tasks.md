# Tareas — Objetivo semanal de estudio

## Tareas

- [x] **T1. Extraer el cálculo semanal a lógica pura**
  - Depende de: ninguna
  - Archivos que toca: `logic.js`, `app.js`, `tests/weekly-goal.test.js`
  - RF que cubre: RF-1
  - Tests: escribir primero pruebas con `today` fijo para lunes y otro día; incluir sesiones del lunes y de hoy, varias en una fecha, fechas anteriores y futuras, hoy lunes y cruces de mes/año.
  - Hecho cuando: `node --test` termina con código 0 y el total visible conserva la regla anterior; `getWeeklyMinutes` recibe `today` y no consulta reloj, DOM ni almacenamiento. Duración estimada: 25 min.

- [x] **T2. Validar objetivos semanales**
  - Depende de: ninguna
  - Archivos que toca: `logic.js`, `tests/weekly-goal.test.js`
  - RF que cubre: RF-2
  - Tests: escribir primero casos para enteros positivos, cero, negativos y valores fraccionarios.
  - Hecho cuando: `node --test` termina con código 0; solo los enteros mayores que cero son válidos. Duración estimada: 20 min.

- [x] **T3. Añadir el marcado para configurar y consultar la meta**
  - Depende de: T1, T2
  - Archivos que toca: `index.html`
  - RF que cubre: RF-2, RF-3
  - Tests: no aplica; tarea de interfaz. Comprobación manual abriendo `index.html`.
  - Hecho cuando: el documento contiene en español un control para definir/modificar la meta y regiones diferenciadas para la invitación sin meta y el progreso, sin ocultar ni alterar las áreas actuales. Duración estimada: 20 min.

- [x] **T4. Guardar la meta por separado de las sesiones**
  - Depende de: T2, T3
  - Archivos que toca: `app.js`
  - RF que cubre: RF-2
  - Tests: no aplica en `node --test` para `localStorage`; comprobar manualmente valores válidos e inválidos y que las sesiones existentes permanecen intactas.
  - Hecho cuando: en `index.html`, una meta válida se conserva después de recargar y se puede modificar; los valores inválidos no sustituyen la meta válida y el registro de sesiones sigue usando sus datos existentes sin cambios ni migración. Duración estimada: 25 min.

- [x] **T5. Renderizar progreso y estados del objetivo**
  - Depende de: T1, T3, T4
  - Archivos que toca: `app.js`
  - RF que cubre: RF-1, RF-3
  - Tests: no aplica; tarea de interfaz. Comprobar manualmente sin meta y con progreso menor, igual y mayor al objetivo.
  - Hecho cuando: sin meta se muestra la invitación y no el progreso; con meta se presentan minutos y objetivo; al igualarlo se informa cumplimiento y al superarlo se informa el total real y el exceso. La modificación de meta conserva en el cálculo todas las sesiones de la semana. Duración estimada: 25 min.

- [x] **T6. Integrar estilos del objetivo semanal**
  - Depende de: T3, T5
  - Archivos que toca: `styles.css`
  - RF que cubre: RF-2, RF-3
  - Tests: no aplica; tarea de interfaz. Comprobación manual en escritorio y ancho móvil.
  - Hecho cuando: los controles, mensajes y cifras son legibles, no se solapan ni provocan desbordamiento horizontal, y la sección se integra con los estilos actuales. Duración estimada: 20 min.

- [x] **T7. Verificar la funcionalidad completa**
  - Depende de: T1, T2, T3, T4, T5, T6
  - Archivos que toca: ninguno, salvo correcciones derivadas directamente de la verificación en los archivos anteriores.
  - RF que cubre: RF-1, RF-2, RF-3
  - Tests: ejecutar `node --test`; resultado esperado: código 0 y todas las pruebas pasan. Comprobación manual adicional en `index.html` abierto directamente.
  - Hecho cuando: la suite pasa y la comprobación manual cubre el ciclo semanal, futuro, duplicados diarios, meta inválida, persistencia tras recargar, estados inferior/igual/superior y conservación de sesiones sin errores de consola. Duración estimada: 25 min.

## Cobertura RF → tareas

| RF | Tareas |
|---|---|
| RF-1 | T1, T5, T7 |
| RF-2 | T2, T3, T4, T6, T7 |
| RF-3 | T3, T5, T6, T7 |

Todos los requisitos funcionales tienen tareas asignadas. Son 7 tareas, cada
una estimada entre 20 y 25 minutos, con lógica y sus pruebas antes de la
integración de interfaz.