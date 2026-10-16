# Objetivo semanal de estudio

## Estado

implementada

## Contexto y objetivo

El Diario de Estudio ya permite consultar los minutos estudiados durante la
semana actual. La semana empieza el lunes local y el cálculo llega hasta hoy,
inclusive. Esta funcionalidad permitirá definir un objetivo de minutos
semanales y consultar el avance con relación a ese objetivo, para ayudar a la
persona a mantener su motivación.

El cálculo del avance reutilizará la misma ventana semanal: no contará sesiones
anteriores al lunes local de esta semana ni sesiones con fecha posterior a hoy.
Las sesiones guardadas se conservarán sin modificación ni pérdida.

## Usuarios

- Personas que registran sus sesiones de estudio en el Diario de Estudio y
  quieren fijar una meta semanal.
- Personas que quieren comparar los minutos estudiados durante la semana con
  los minutos de su objetivo.

## Historias de usuario

- HU-1: Como estudiante, quiero indicar cuántos minutos quiero estudiar cada
  semana para tener una meta concreta.
- HU-2: Como estudiante, quiero consultar los minutos estudiados esta semana y
  compararlos con mi objetivo para saber cuánto me falta.
- HU-3: Como estudiante, quiero que el progreso semanal se calcule con la misma
  regla que los minutos semanales existentes para que ambas cifras coincidan.

## Definiciones

- Semana actual: periodo desde el lunes de la semana local actual hasta la
  fecha local de hoy, ambas inclusive.
- Progreso semanal: suma de los minutos de las sesiones cuya fecha local esté
  dentro de la semana actual. Las fechas posteriores a hoy quedan excluidas.

## Requisitos funcionales

### RF-1. Cálculo del progreso

- Cuando el sistema muestre el progreso del objetivo semanal, deberá sumar los
  minutos de las sesiones desde el lunes local de la semana actual hasta hoy,
  inclusive.
- Cuando una sesión tenga una fecha local posterior a hoy, el sistema deberá
  excluir sus minutos del progreso semanal.
- Cuando una sesión tenga una fecha anterior al lunes local de esta semana, el
  sistema deberá excluir sus minutos del progreso semanal.
- Cuando existan varias sesiones dentro de la semana actual, el sistema deberá
  sumar los minutos de todas ellas, sin descartar sesiones por coincidir en
  fecha.
- Cuando cambie la fecha local de hoy o cambie el conjunto de sesiones, el
  sistema deberá calcular el progreso usando la fecha y las sesiones actuales.

### RF-2. Definición del objetivo

- Cuando la persona establezca un objetivo semanal válido, el sistema deberá
  conservar el valor establecido y permitir consultarlo junto con el progreso
  semanal. El sistema deberá reutilizar ese mismo objetivo cada semana, no solo
  durante la semana en que se definió. Un objetivo válido deberá ser un número
  entero de minutos mayor que cero.
- Cuando la persona cierre y vuelva a abrir la aplicación, el sistema deberá
  conservar el objetivo semanal establecido, salvo que haya sido modificado.
  - Cuando la persona intente establecer un valor que no sea un número entero
  positivo de minutos, el sistema deberá rechazarlo como inválido.
- Cuando la persona modifique un objetivo semanal válido, el sistema deberá
  mostrar el nuevo valor como objetivo y compararlo con todos los minutos
  acumulados desde el lunes local de la semana en curso hasta hoy, inclusive,
  también los acumulados antes del cambio.

### RF-3. Presentación del avance

- Cuando exista un objetivo semanal establecido, el sistema deberá presentar
  los minutos acumulados en la semana y el valor del objetivo para que ambos
  puedan compararse.
- Cuando no exista un objetivo semanal establecido, el sistema deberá mostrar
  una invitación para configurarlo y no deberá mostrar el progreso semanal.
- Cuando los minutos acumulados igualen o superen el objetivo, el sistema
  deberá mostrar el estado de objetivo cumplido.
- Cuando los minutos acumulados superen el objetivo, el sistema deberá mostrar
  el total real de minutos acumulados y cuántos minutos exceden el objetivo.

## Requisitos no funcionales

- El cálculo semanal deberá usar fechas de calendario locales y la misma regla
  de inicio y fin de semana que el cálculo de minutos semanales existente.
- Las sesiones existentes deberán conservarse sin modificación ni pérdida,
  tanto al definir o modificar el objetivo como al consultar el progreso.
- El objetivo semanal establecido deberá conservarse después de cerrar y volver
  a abrir la aplicación.
- La funcionalidad no deberá requerir que la persona vuelva a registrar
  sesiones existentes para que se incluyan en el progreso.
- La interfaz y sus mensajes deberán estar en español.

## Casos límite

- No hay sesiones desde el lunes local de esta semana: el progreso es cero.
- Hay varias sesiones en una fecha de esta semana: se incluyen todas sus
  duraciones.
- Hay sesiones antes del lunes de esta semana: no contribuyen al progreso.
- Hay sesiones con fecha posterior a hoy: no contribuyen al progreso.
- El lunes local de esta semana coincide con hoy: solo se incluyen sesiones de
  hoy.
- El periodo cruza un cambio de mes o de año: se incluyen las sesiones según su
  fecha local y los límites de la semana.
- El objetivo no está establecido: se muestra una invitación para configurarlo
  y no se muestran minutos acumulados ni progreso.
- Se intenta establecer un objetivo de cero, negativo o fraccionario: el valor
  se rechaza como inválido.
- El objetivo se modifica durante la semana: el nuevo objetivo se compara con
  todos los minutos acumulados desde el lunes local hasta hoy, incluidos los
  minutos estudiados antes del cambio.
- Al comenzar una semana posterior, se reutiliza el mismo objetivo semanal
  establecido, salvo que haya sido modificado.
- Después de cerrar y volver a abrir la aplicación, el objetivo semanal
  establecido conserva el mismo valor, salvo que haya sido modificado.
- El progreso iguala el objetivo: se muestra el estado de objetivo cumplido.
- El progreso supera el objetivo: se muestra el estado de objetivo cumplido,
  el total real de minutos y la cantidad de minutos que exceden el objetivo.

## Fuera de alcance

- Cambiar la regla existente de semana local, lunes como primer día o el límite
  de hoy inclusive.
- Alterar, borrar, migrar o reemplazar sesiones guardadas.
- Incluir sesiones futuras o anteriores a la semana actual en el progreso.
- Añadir objetivos diarios, notificaciones, recomendaciones o comparaciones
  con otras personas.

## Criterios de finalización

- Con sesiones de 20 minutos el lunes y 15 minutos el miércoles de la semana
  actual, el progreso mostrado es 35 minutos.
- Con una sesión anterior al lunes y otra posterior a hoy, ninguna de las dos
  contribuye al progreso mostrado.
- Con varias sesiones en una misma fecha de esta semana, el progreso incluye la
  suma de todas sus duraciones.
- Al establecer un objetivo de minutos enteros positivos, el sistema lo acepta;
  al intentar establecer cero, un valor negativo o una fracción, lo rechaza como
  inválido.
- El objetivo establecido se puede consultar junto con los minutos acumulados
  y se reutiliza en todas las semanas sucesivas, salvo que se modifique.
- Si se acumulan 25 minutos el lunes y 20 el miércoles, y ese miércoles se
  cambia el objetivo de 60 a 40 minutos, el sistema presenta los 45 minutos
  acumulados frente al nuevo objetivo de 40 minutos.
- Sin un objetivo establecido, el sistema muestra una invitación para
  configurarlo y no muestra los minutos acumulados ni el progreso semanal.
- Establecer, modificar y consultar un objetivo no altera ni elimina ninguna
  sesión existente.
- Cuando el progreso iguala el objetivo, la interfaz muestra el estado de
  objetivo cumplido.
- Con un objetivo de 40 minutos y un progreso de 45 minutos, la interfaz muestra
  el estado de objetivo cumplido, los 45 minutos acumulados y que se excede el
  objetivo por 5 minutos.

## Dudas abiertas

Ninguna.