# Plan — Objetivo semanal de estudio

## Alcance

Este plan cubre RF-1, RF-2 y RF-3 de la spec aprobada. Mantiene la regla
existente de semana local (lunes a hoy, ambos inclusive), permite consultar y
editar una meta semanal persistente, y conserva sin cambios las sesiones que
ya guarda la aplicación. No requiere dependencias ni compilación.

## Archivos previstos

| Acción | Archivo | Responsabilidad | RF |
|---|---|---|---|
| Modificar | `logic.js` | Añadir funciones puras para sumar minutos semanales con `today` explícito y validar una meta entera positiva. | RF-1, RF-2 |
| Modificar | `app.js` | Pasar la fecha local actual a la lógica; cargar y guardar la meta de forma independiente; conectar sus cambios y las sesiones al renderizado del avance. | RF-1, RF-2, RF-3 |
| Modificar | `index.html` | Añadir la interfaz en español para configurar la meta y mostrar invitación, minutos, objetivo y estado de cumplimiento. | RF-2, RF-3 |
| Modificar | `styles.css` | Integrar los nuevos controles y estados con los estilos existentes y conservar la adaptación de pantalla. | RF-2, RF-3 |
| Crear | `tests/weekly-goal.test.js` | Probar la suma semanal y la validación de metas con el ejecutor nativo de Node. | RF-1, RF-2 |

## Funciones puras

1. `getWeeklyMinutes(sessions, today)` en `logic.js` recibe sesiones y una fecha
   local válida en formato `AAAA-MM-DD`. Calcula el lunes de esa semana con
   componentes locales y suma `minutes` de cada sesión cuya `date` esté entre
   ese lunes y `today`, inclusive. No consulta reloj, DOM ni almacenamiento, ni
   modifica las sesiones. Cubre RF-1.
2. `isValidWeeklyGoal(value)` recibe el valor numérico y devuelve si es un
   entero mayor que cero. No convierte ni persiste el texto del formulario;
   esa responsabilidad pertenece a la interfaz. Cubre RF-2.

La interfaz obtiene la fecha local mediante el helper existente y la pasa a
`getWeeklyMinutes`. La meta no es un cálculo derivado de sesiones: se carga y
guarda separadamente.

## Algoritmo en pseudocódigo

```text
función getWeeklyMinutes(sessions, today):
    construir una fecha local con año, mes y día de today
    moverla hacia atrás al lunes de esa misma semana usando setDate()
    monday = convertir la fecha local resultante a AAAA-MM-DD
    devolver la suma de session.minutes para cada sesión donde:
        session.date >= monday y session.date <= today

función isValidWeeklyGoal(value):
    devolver value es entero y value > 0

al renderizar la interfaz:
    today = fecha local actual en AAAA-MM-DD
    weeklyMinutes = getWeeklyMinutes(sessions, today)
    si no existe una meta guardada:
        mostrar invitación y ocultar el progreso
    si existe una meta:
        mostrar weeklyMinutes y la meta
        si weeklyMinutes >= meta:
            mostrar objetivo cumplido
        si weeklyMinutes > meta:
            mostrar weeklyMinutes y weeklyMinutes - meta como exceso
```

El cálculo debe conservar los comportamientos de límites ya definidos: varias
sesiones del mismo día se suman individualmente; sesiones anteriores al lunes y
posteriores a `today` no cuentan; cuando hoy es lunes solo cuentan las sesiones
de hoy. Cubre RF-1.

## Interfaz

- Añadir una sección compacta con un campo numérico de minutos y una acción para
  establecer o modificar la meta. La interfaz informa cuando el valor no sea
  entero positivo y no lo guarda como meta válida. Cubre RF-2.
- Si no hay meta, mostrar una invitación a configurarla sin presentar minutos
  acumulados ni progreso. Cubre RF-3.
- Con una meta, mostrar los minutos de esta semana y el valor objetivo. Al
  alcanzar o superar el objetivo, mostrar el estado de cumplimiento; si se
  supera, mostrar además el total real y los minutos excedidos. Cubre RF-3.
- Recalcular y presentar el avance al iniciar, cambiar la meta o actualizar las
  sesiones, usando siempre la fecha local actual de ese renderizado. Cubre
  RF-1 y RF-3.
- Insertar mensajes mediante `textContent`, de acuerdo con la constitución.
  Cubre RF-2 y RF-3.

## Decisiones del plan

| Decisión | Motivo | Alternativa descartada |
|---|---|---|
| Mover la suma semanal a `logic.js` y pasar `today` explícitamente. | El cálculo actual en `app.js` consulta `new Date()` internamente; separarlo permite fijar la fecha en pruebas y obedece la constitución sin cambiar la regla del producto. | Mantener el cálculo dependiente del reloj dentro de `app.js` o duplicarlo para el objetivo. |
| Reutilizar la misma suma semanal para el total actual y el progreso de la meta. | Evita que las cifras diverjan en límites de semana y hace que el total ya mostrado por la aplicación siga usando la misma regla. | Mantener dos implementaciones semanales independientes. |
| Persistir la meta con una clave de almacenamiento independiente de `diario-de-estudio-sesiones`. | Permite que la meta sobreviva al cierre sin reescribir, migrar ni reemplazar los datos de sesiones; la carga de sesiones existente permanece intacta. | Añadir la meta al JSON de sesiones o modificar su formato. |
| Ampliar el objeto global de `logic.js` para el navegador y sus exportaciones CommonJS para Node. | `index.html` ya carga `logic.js` antes de `app.js`; `logic.js` ya publica `HeatMapLogic` en `globalThis` y `module.exports`, patrón que permite apertura directa y pruebas sin build. | Usar módulos que dependan de un servidor o copiar la lógica en el test y la interfaz. |
| Mantener HTML, CSS y JavaScript nativos y probar la lógica con `node --test`. | Respeta la constitución y el flujo actual de la aplicación, que se abre directamente desde `index.html`. | Añadir frameworks, dependencias o un proceso de compilación. |

## Estrategia de pruebas y comprobación

En `tests/weekly-goal.test.js`, importar `logic.js` mediante `require` y usar
fechas fijas. Escribir primero las pruebas de cada función pura y ejecutarlas
con `node --test` antes de integrarlas en la interfaz.

- RF-1: comprobar lunes de inicio, inclusión de lunes y hoy, exclusión de
  sesiones anteriores y futuras, suma de varias sesiones de una fecha y el
  caso en que hoy es lunes. Añadir casos que crucen mes y año.
- RF-2: comprobar que se aceptan enteros positivos y se rechazan cero, negativos
  y fracciones. En navegador, comprobar guardar, modificar y recuperar la meta
  tras recargar, verificando que el contenido de las sesiones no cambia.
- RF-3: comprobar manualmente ausencia de meta, progreso inferior, igual y
  superior al objetivo, incluido el total real y el exceso.
- Abrir `index.html` directamente para validar la carga clásica de `logic.js`
  antes de `app.js`, la persistencia, los mensajes en español y que guardar o
  modificar la meta no altere sesiones. Ejecutar `node --test` para validar las
  funciones en Node sin DOM ni dependencias.

La implementación no debe avanzar con pruebas en rojo. La comprobación manual
debe cubrir el recorrido completo en navegador además de la suite automatizada.