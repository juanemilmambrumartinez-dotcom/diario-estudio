# Tareas — Mapa de calor de estudio

## Decisiones confirmadas pendientes de incorporar a la spec

Las siguientes respuestas se confirmaron durante la preparación de tareas. T1
debe registrarlas en la spec activa antes de empezar la implementación:

Decisión confirmada para integrar la lógica sin build: cargar `logic.js` con
una etiqueta `<script>` clásica antes de `app.js`, exponiendo las funciones
puras en un objeto global explícito. Esta decisión mantiene el uso directo de
`file:///` y la separación de lógica que exige la Constitución. El cableado
debe incorporarse al cálculo puro de T2 y a la integración de T7.

Decisión confirmada para los días posteriores a hoy dentro de la semana actual:
se muestran como celdas vacías, sin actividad ni detalle de sesiones. La
cuadrícula semanal permanece completa, pero las sesiones futuras se excluyen
de los datos y del detalle.

Decisión confirmada para pantallas táctiles: al tocar una celda, se muestra su
detalle; al tocar otra celda, el detalle se actualiza.

Decisión confirmada para la disposición: las semanas serán columnas y los días
de lunes a domingo, filas.

Decisión confirmada para la paleta: usar cuatro intensidades de la paleta azul
actual del Diario de Estudio.

Decisión confirmada para sesiones con fecha inválida: excluirlas únicamente del
cálculo del mapa y conservar intactos los datos almacenados.

Decisión confirmada para los minutos fraccionarios del detalle: mostrar hasta
dos decimales, sin ceros finales innecesarios. La clasificación sigue usando el
valor exacto sin redondear.

Las decisiones aprobadas en esta sección se incorporarán a la spec durante T1;
hasta entonces T1 sigue siendo requisito previo de implementación.

## Tareas

### T1 — Incorporar las decisiones aprobadas a la especificación

- [x] Actualizar la especificación activa con las decisiones aprobadas de esta
  lista, sin cambiar ningún otro comportamiento.
- Depende de: ninguna
- Archivos que toca: `specs/001-heat-map/spec.md`
- RF que cubre: RF-1, RF-2, RF-3, RF-4, RF-6
- Tests: no aplica; es una tarea de especificación.
- Hecho cuando: las decisiones confirmadas quedan documentadas en la spec,
  todas las dudas que bloquean la implementación se resuelven y la spec mantiene
  coherencia con la Constitución.

### T2 — Calcular el periodo local del mapa

- [x] Escribir primero las pruebas y luego implementar la función pura que
  devuelve las fechas del periodo visible usando `today` como parámetro.
- Depende de: T1
- Archivos que toca: `logic.js`, `tests/heat-map.test.js`
- RF que cubre: RF-1
- Tests: escribir primero casos con `today` en lunes y domingo, inicio en el
  lunes de hace 11 semanas, inclusión de hoy y recorrido local a través de fin
  de mes, año y día bisiesto.
- Hecho cuando: `node --test` termina con código 0; la función recibe `today`,
  no consulta el reloj ni usa parsing UTC y calcula el periodo esperado.

### T3 — Agregar sesiones por fecha y excluir datos inválidos o futuros

- [x] Escribir primero las pruebas y luego implementar la agregación diaria,
  excluyendo fechas futuras e inválidas del mapa sin mutar ni borrar sesiones.
- Depende de: T2
- Archivos que toca: `logic.js`, `tests/heat-map.test.js`
- RF que cubre: RF-2, RF-4, RF-5
- Tests: escribir primero pruebas para sesiones repetidas en una fecha, huecos,
  días sin sesiones, fechas futuras, sesiones fuera del periodo, periodo sin
  sesiones y sesiones con fecha inválida. Comprobar que la entrada no se muta.
- Hecho cuando: `node --test` termina con código 0; minutos y cantidades
  diarios son correctos y las sesiones futuras o inválidas no afectan al mapa
  ni se borran del arreglo recibido.

### T4 — Clasificar niveles de actividad

- [x] Escribir primero las pruebas y luego implementar la clasificación de
  minutos diarios en sin actividad y cuatro niveles proporcionales al máximo.
- Depende de: T3
- Archivos que toca: `logic.js`, `tests/heat-map.test.js`
- RF que cubre: RF-2, RF-3
- Tests: escribir primero valores iguales e inmediatamente inferiores o
  superiores a los límites 25 %, 50 % y 75 %; probar día máximo, cero minutos,
  máximo cero y minutos fraccionarios sin redondear.
- Hecho cuando: `node --test` termina con código 0 y cada valor obtiene el nivel
  correspondiente según los tramos de la spec.

### T5 — Añadir la estructura accesible del mapa

- [x] Añadir al documento la región del mapa, su título, la leyenda, el espacio
  de estado vacío y la estructura que se aprobó en T1. Mantener la funcionalidad
  existente operativa mientras todavía no se conectan los datos.
- Depende de: T1, T2, T3, T4
- Archivos que toca: `index.html`
- RF que cubre: RF-1, RF-5, RF-6
- Tests: no aplica; tarea de marcado. Comprobación manual en navegador.
- Hecho cuando: abrir `index.html` directamente conserva el formulario y la
  lista actuales sin errores de consola y muestra la estructura aprobada del
  mapa en español.

### T6 — Estilar niveles, leyenda y cuadrícula adaptable

- [x] Aplicar los estilos aprobados a los días sin actividad y a los cuatro
  niveles, con orden semanal legible, foco perceptible y adaptación al ancho
  móvil. No depender solo del color para comunicar el nivel.
- Depende de: T1, T5
- Archivos que toca: `styles.css`
- RF que cubre: RF-1, RF-3, RF-5, RF-6
- Tests: no aplica; tarea visual. Comprobación manual en navegador.
- Hecho cuando: en 375 px y en escritorio, la estructura no provoca
  desbordamiento horizontal ni texto recortado; el foco de teclado se distingue
  y los niveles tienen las distinciones visuales aprobadas.

### T7 — Conectar el cálculo puro con la interfaz

- [x] Cargar `logic.js` con la etiqueta `<script>` clásica antes de `app.js` y
  conectar el objeto global explícito de funciones puras con la fecha local
  actual y las sesiones existentes. Renderizar las celdas del periodo y sus
  niveles; actualizar el mapa al guardar o borrar una sesión, sin cambiar el
  almacenamiento existente.
- Depende de: T2, T3, T4, T5, T6
- Archivos que toca: `app.js`, `index.html` (solo si requiere cableado de
  marcado aprobado)
- RF que cubre: RF-1, RF-3, RF-4
- Tests: no aplica; la lógica ya debe estar cubierta en T2–T4. Comprobación manual
  de integración y persistencia en navegador.
- Hecho cuando: al abrir `index.html` directamente se representa el periodo y
  los niveles de las sesiones existentes; una fecha futura no aparece como
  actividad; al guardar, borrar y recargar el mapa se actualiza sin alterar ni
  perder sesiones y no hay errores de consola.

### T8 — Añadir detalles y estados vacíos accesibles

- [x] Mostrar la fecha, minutos diarios y cantidad de sesiones al enfocar una
  celda con teclado y al tocarla; al tocar otra celda, actualizar el detalle.
  Mostrar la cuadrícula vacía y la invitación cuando no haya actividad en el
  periodo. Insertar los textos con APIs seguras.
- Depende de: T7
- Archivos que toca: `index.html`, `styles.css`, `app.js`
- RF que cubre: RF-2, RF-5, RF-6
- Tests: no aplica; comprobación manual en navegador con teclado y toque.
- Hecho cuando: el detalle de una celda vacía informa cero minutos y cero
  sesiones; el detalle de una celda con varias sesiones informa la suma y la
  cantidad correctas; ambas interacciones son utilizables y aparece el mensaje
  de invitación cuando el periodo está vacío.

### T9 — Ejecutar la suite completa de lógica

- [ ] Ejecutar todos los tests de lógica del proyecto después de integrar la
  funcionalidad.
- Depende de: T2, T3, T4, T7, T8
- Archivos que toca: ninguno, salvo correcciones necesarias en `logic.js` o
  `tests/heat-map.test.js`.
- RF que cubre: RF-1, RF-2, RF-3, RF-4, RF-5
- Tests: ejecutar `node --test`, cubriendo varias sesiones diarias, fechas
  futuras e inválidas, huecos, niveles límite, periodo vacío y cruces de mes y
  año.
- Hecho cuando: `node --test` termina con código 0 y todas las pruebas pasan.

### T10 — Completar la verificación manual en navegador

- [ ] Comprobar la integración en `file:///`, la consulta de detalles, los
  estados vacíos, los tamaños de pantalla y que las sesiones existentes no se
  pierdan.
- Depende de: T7, T8, T9
- Archivos que toca: ninguno, salvo correcciones directamente derivadas de los
  defectos encontrados, en los archivos aprobados por la spec.
- RF que cubre: RF-1, RF-2, RF-3, RF-4, RF-5, RF-6
- Tests: pruebas manuales en navegador para el periodo, duplicados diarios,
  niveles, futuro, huecos, cruce de calendario, interacción por teclado y toque,
  estado vacío, 375 px, escritorio y persistencia.
- Hecho cuando: las pruebas manuales pasan en `file:///`, no hay errores de
  consola, overflow horizontal ni contenido cortado, y guardar, borrar y
  recargar conserva intactas las sesiones existentes.

## Cobertura RF -> tareas

| RF | Tareas |
|---|---|
| RF-1 | T1, T2, T5, T6, T7, T9, T10 |
| RF-2 | T1, T3, T4, T8, T9, T10 |
| RF-3 | T1, T4, T6, T7, T9, T10 |
| RF-4 | T1, T3, T7, T9, T10 |
| RF-5 | T3, T5, T6, T8, T9, T10 |
| RF-6 | T1, T5, T6, T8, T10 |

Todos los RF quedan cubiertos por tareas previstas; el trabajo de
implementación está bloqueado hasta completar T1. La lógica y sus tests se
completan antes de iniciar la interfaz, y ningún test puede quedar rojo al
cerrar T2, T3 o T4.
