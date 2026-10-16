# Mapa de calor de estudio

## Contexto y objetivo

El Diario de Estudio permite registrar sesiones y consultar métricas de
constancia. Esta funcionalidad añade un mapa de calor que permite reconocer de
un vistazo los días estudiados durante las últimas 12 semanas y comparar el
tiempo dedicado en cada día.

## Usuarios

- Personas que registran sus sesiones de estudio en el Diario de Estudio.
- Personas que quieren reconocer visualmente su constancia y la distribución
  reciente de sus minutos de estudio.

## Historias de usuario

- Como estudiante, quiero ver qué días estudié durante las últimas semanas
  para reconocer mis hábitos.
- Como estudiante, quiero distinguir los días con más minutos para comparar
  cuánto tiempo dediqué a estudiar.
- Como estudiante, quiero consultar la fecha, los minutos y el número de
  sesiones de un día para entender el valor representado.
- Como estudiante sin sesiones recientes, quiero ver el mapa vacío y una
  invitación a registrar una sesión para saber cómo empezar.

## Requisitos funcionales

### RF-1. Periodo mostrado

- Cuando se muestre el mapa, el sistema deberá incluir 12 semanas calendario,
  incluida la semana local actual, aunque esté incompleta.
- Cuando se determine el inicio del periodo, el sistema deberá tomar el lunes
  local de la semana actual y retroceder 11 semanas calendario.
- Cuando se determine el final del periodo, el sistema deberá usar la fecha
  local de hoy, inclusive.
- Cuando se muestre un día de la semana, el sistema deberá respetar el orden
  semanal de lunes a domingo.
- Cuando se muestre la cuadrícula, el sistema deberá organizar las semanas como
  columnas y los días de lunes a domingo como filas.

### RF-2. Minutos y sesiones por día

- Cuando haya una o más sesiones en una fecha local, el sistema deberá sumar
  los minutos de todas las sesiones de esa fecha para obtener el total diario.
- Cuando se consulte el detalle de un día, el sistema deberá mostrar la fecha
  local, la suma de minutos y el número de sesiones registradas en esa fecha.
- Cuando el total de minutos del detalle tenga una parte fraccionaria, el
  sistema deberá mostrar hasta dos decimales, sin ceros finales innecesarios.
- Cuando no haya sesiones en una fecha, el sistema deberá tratar sus minutos
  como cero y no asignarle un nivel de actividad con minutos positivos.
- Cuando una sesión tenga una fecha local inválida, el sistema deberá excluirla
  únicamente del cálculo del mapa y conservar intactos los datos almacenados.

### RF-3. Intensidad del color

- Cuando exista al menos un día con minutos positivos en el periodo, el sistema
  deberá usar como referencia el mayor total diario del periodo.
- Cuando un día tenga minutos positivos de hasta el 25 % de esa referencia,
  el sistema deberá asignarle el primer nivel de actividad.
- Cuando un día supere el 25 % y sea de hasta el 50 % de la referencia, el
  sistema deberá asignarle el segundo nivel de actividad.
- Cuando un día supere el 50 % y sea de hasta el 75 % de la referencia, el
  sistema deberá asignarle el tercer nivel de actividad.
- Cuando un día supere el 75 % de la referencia y no supere la referencia,
  el sistema deberá asignarle el cuarto nivel de actividad.
- Cuando un día tenga cero minutos, el sistema deberá mostrarlo sin actividad,
  distinto de los cuatro niveles de actividad.
- Cuando todos los días del periodo tengan cero minutos, el sistema deberá
  mostrar todos los días sin actividad y no deberá asignar niveles positivos.
- Cuando represente los cuatro niveles de actividad, el sistema deberá usar
  cuatro intensidades de la paleta azul actual del Diario de Estudio.
- Cuando clasifique los minutos de un día, el sistema deberá usar el valor
  exacto sin redondearlo.

### RF-4. Exclusión de fechas futuras

- Cuando una sesión tenga una fecha local posterior a hoy, el sistema deberá
  excluir sus minutos y sesiones del mapa y de la referencia de intensidad.
- Cuando una fecha sea futura, el sistema no deberá presentarla como un día
  estudiado.
- Cuando la cuadrícula incluya días posteriores a hoy de la semana actual, el
  sistema deberá mostrarlos como celdas vacías, sin actividad ni detalle de
  sesiones, y mantener completa la cuadrícula semanal.

### RF-5. Periodo sin sesiones

- Cuando no haya sesiones en el periodo visible, el sistema deberá conservar
  la cuadrícula sin actividad.
- Cuando no haya sesiones en el periodo visible, el sistema deberá mostrar un
  mensaje en español que invite a registrar una sesión.
- Cuando haya sesiones fuera del periodo visible, el sistema deberá tratar el
  periodo visible como vacío si no contiene sesiones.

### RF-6. Consulta de detalles

- Cuando el usuario señale un día con el puntero o enfoque su representación,
  el sistema deberá permitir consultar la fecha local, sus minutos totales y
  la cantidad de sesiones.
- Cuando el usuario toque una celda, el sistema deberá mostrar su detalle y,
  cuando toque otra celda, deberá actualizar el detalle mostrado.
- Cuando se muestre el detalle de un día sin sesiones, el sistema deberá
  indicar cero minutos y cero sesiones.

## Requisitos no funcionales

- Las fechas deberán interpretarse y presentarse usando la fecha de calendario
  local, con formato de almacenamiento `AAAA-MM-DD`.
- Las sesiones existentes deberán conservarse sin modificación ni pérdida.
- La función deberá respetar la exclusión de fechas futuras y la agrupación de
  varias sesiones en un único día, manteniendo la suma de sus minutos.
- El mapa y sus detalles deberán poder consultarse con teclado, con un foco
  perceptible y con información textual equivalente a la codificada por color.
- La cuadrícula y sus textos deberán permanecer utilizables a 375 px de ancho,
  sin desbordamiento horizontal ni contenido recortado.
- La interfaz y los mensajes deberán estar en español.

## Casos límite

- No hay sesiones guardadas.
- Hay sesiones guardadas, pero ninguna cae dentro de las 12 semanas visibles.
- Hay varias sesiones en la misma fecha; se suman sus minutos y se cuenta cada
  sesión en el detalle.
- Todas las fechas visibles carecen de sesiones; el máximo de referencia es
  cero.
- Solo hay una fecha con minutos positivos; esa fecha recibe el cuarto nivel.
- Una sesión futura coincide con un día de la semana actual; su celda permanece
  vacía y no ofrece detalle de sesiones.
- Una sesión tiene una fecha inválida; se excluye del cálculo del mapa sin
  modificar los datos almacenados.
- Un detalle contiene minutos fraccionarios; se muestran hasta dos decimales,
  sin ceros finales innecesarios.
- El periodo visible cruza un cambio de mes o de año.
- Una sesión registrada hoy cerca de la medianoche pertenece a la fecha local
  correspondiente, no a una fecha derivada de UTC.

## Fuera de alcance

- Elegir un periodo distinto de las 12 semanas definidas.
- Cambiar el inicio de semana de lunes a otro día.
- Añadir objetivos diarios, notificaciones o recomendaciones de estudio.
- Modificar, borrar o migrar sesiones como parte de la consulta del mapa.
- Mostrar fechas posteriores a hoy como actividad realizada.
- Añadir comparaciones con otros usuarios o compartir el historial.

## Criterios de finalización

- Las sesiones de una misma fecha se representan como un único día y sus
  minutos se suman.
- La vista cubre 12 semanas calendario desde el lunes local situado 11 semanas
  antes del lunes de esta semana, hasta hoy inclusive.
- Los días con minutos positivos se clasifican de forma comprobable en los
  cuatro tramos establecidos; los días sin sesiones se muestran sin actividad.
- Las sesiones futuras no afectan los minutos ni el máximo usados para la
  intensidad, y no aparecen como actividad.
- Los días posteriores a hoy de la semana actual aparecen como celdas vacías,
  sin detalle de sesiones.
- Las sesiones con fechas inválidas se excluyen únicamente del cálculo del
  mapa, y la clasificación usa minutos exactos sin redondear.
- Los cuatro niveles usan intensidades de la paleta azul actual; el detalle se
  puede consultar con teclado y mediante toque, que actualiza el detalle al
  seleccionar otra celda.
- El estado sin sesiones muestra la cuadrícula sin actividad y una invitación
  a registrar una sesión.
- Al consultar un día se pueden obtener su fecha local, total de minutos y
  cantidad de sesiones; la consulta mediante teclado es posible.
- Las fechas de fin e inicio de mes y de año no desplazan el periodo ni asignan
  sesiones a un día distinto.
- La vista se puede usar a 375 px de ancho sin desbordamiento horizontal ni
  texto recortado.

## Dudas abiertas

No hay dudas abiertas que bloqueen la implementación.
