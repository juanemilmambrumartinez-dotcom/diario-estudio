# Plan — Mapa de calor de estudio

## Alcance y estado

Este plan propone cómo cubrir los requisitos RF-1 a RF-6 respetando
`docs/constitution.md`: JavaScript puro, cálculos separados en funciones
sin efectos secundarios, fechas locales, compatibilidad de datos, interfaz en
español y pruebas con `node --test`.

Las decisiones que faltaban ya se incorporaron a la spec durante T1: los días
futuros de la semana actual se muestran vacíos, las semanas son columnas, los
días se ordenan de lunes a domingo, el detalle se consulta también con toque y
los niveles usan cuatro intensidades de la paleta azul actual. Las fechas
inválidas se excluyen solo del cálculo y no se alteran las sesiones guardadas.

## Archivos previstos

| Acción | Archivo | Responsabilidad | Requisitos |
|---|---|---|---|
| Modificar | `index.html` | Añadir el título, la leyenda, la región accesible del mapa y el espacio para el estado vacío, en español. | RF-1, RF-5, RF-6 |
| Modificar | `styles.css` | Dar estilo a las celdas según su actividad, a la leyenda, a los detalles, al foco de teclado y al diseño adaptable. | RF-1, RF-3, RF-5, RF-6 |
| Modificar | `app.js` | Obtener sesiones y la fecha local actual, solicitar el resultado a la lógica pura, renderizarlo con APIs de texto seguras y actualizar el mapa tras las operaciones existentes. No guardar métricas derivadas ni alterar sesiones. | RF-1–RF-6 |
| Crear | `logic.js` | Implementar las funciones puras de periodo, agregación diaria, exclusión futura y clasificación de intensidad. Recibir explícitamente la fecha de hoy; no leer DOM, reloj, almacenamiento ni realizar E/S. | RF-1–RF-4 |
| Crear | `tests/heat-map.test.js` | Verificar cálculos y límites del mapa con el ejecutor nativo `node --test`, sin paquetes adicionales. | RF-1–RF-4 |
| Crear | `specs/001-heat-map/plan.md` | Documentar responsabilidades, propuesta de cálculo, decisiones y estrategia de validación. | Todos |

No se modificarán el formato ni la clave de almacenamiento existentes. La
interfaz consultará las sesiones guardadas, y cualquier estado del mapa será
derivado en cada renderizado. No se borrarán ni migrarán sesiones.

## Funciones puras propuestas

Los nombres siguientes son nombres de diseño para las funciones que se
implementarían en `logic.js`. El idioma del código será inglés, conforme a la
Constitución.

1. `getHeatMapPeriod(today)`
   - Recibe una fecha de calendario local en formato `AAAA-MM-DD`.
   - Devuelve la fecha del lunes inicial (lunes de la semana de `today` menos
     11 semanas) y `today` como último día incluido.
   - No consulta el reloj. Construye fechas con `new Date(year, month - 1, day)`
     y mueve días con `setDate()`.
   - Cubre RF-1.

2. `getHeatMapDays(sessions, today)`
   - Recibe las sesiones actuales y la fecha local `today`.
   - Usa `getHeatMapPeriod(today)`, agrega por fecha local únicamente las
     sesiones del periodo que no sean futuras y devuelve una entrada por cada
     fecha desde el inicio del periodo hasta hoy, inclusive.
   - Cada entrada contiene la fecha, los minutos diarios sumados, el número de
     sesiones y el nivel de actividad.
   - Excluye las fechas futuras de la suma, del número de sesiones y del
     máximo de referencia.
   - Cubre RF-1, RF-2 y RF-4.

3. `getActivityLevel(minutes, maximumMinutes)`
   - Devuelve “sin actividad” para cero minutos o si el máximo es cero.
   - Para minutos positivos, clasifica con la proporción exacta
     `minutes / maximumMinutes`, incluyendo los límites de 25 %, 50 % y 75 %
     en el nivel inferior especificado como “hasta”.
   - No redondea los minutos antes de compararlos.
   - Cubre RF-2 y RF-3.

4. `formatLocalDateParts(dateString)` (si la presentación de fecha requiere
   lógica reutilizable)
   - Divide `AAAA-MM-DD` y construye la fecha con el constructor numérico local;
     no usa `new Date(dateString)` ni métodos UTC.
   - Solo transforma datos recibidos y no consulta la fecha actual.
   - Cubre RF-2 y los requisitos no funcionales de fechas locales.

Las fechas inválidas se excluirán únicamente de los cálculos del mapa, sin
modificar ni descartar las sesiones guardadas, conforme a RF-2.

## Algoritmo del mapa en pseudocódigo

```text
función getHeatMapDays(sessions, today):
    (startDate, endDate) = getHeatMapPeriod(today)
    dailyTotals = mapa vacío por fecha

    para cada session en sessions:
        si session.date < startDate o session.date > endDate:
            continuar
        si session.date > today:
            continuar

        si dailyTotals no contiene session.date:
            dailyTotals[session.date] = { minutes: 0, sessionCount: 0 }

        dailyTotals[session.date].minutes += session.minutes
        dailyTotals[session.date].sessionCount += 1

    maximumMinutes = máximo de minutes en dailyTotals, o cero si está vacío
    days = lista vacía
    date = startDate

    mientras date <= endDate:
        minutes = dailyTotals[date].minutes, o cero si no existe
        sessionCount = dailyTotals[date].sessionCount, o cero si no existe

        si minutes == 0 o maximumMinutes == 0:
            level = "sin-actividad"
        si no:
            ratio = minutes / maximumMinutes
            si ratio <= 0.25: level = nivel 1
            si 0.25 < ratio <= 0.50: level = nivel 2
            si 0.50 < ratio <= 0.75: level = nivel 3
            si 0.75 < ratio <= 1: level = nivel 4

        añadir { date, minutes, sessionCount, level } a days
        date = siguiente día calendario local mediante setDate()

    devolver { startDate, endDate, maximumMinutes, days }
```

La función pura termina en `today`, como establece RF-1. Al renderizar, la
interfaz completa únicamente la columna de la semana actual hasta el domingo
con celdas vacías; esas fechas futuras no contienen datos ni detalle. Cubre
RF-1–RF-4.

## Cómo se pinta en la interfaz

1. La interfaz obtiene la fecha local actual una sola vez por renderizado y la
   pasa a la función pura; no se incorporará cálculo de fecha actual dentro de
   `logic.js`. Cubre RF-1 y RF-4.
2. Se renderizan semanas como columnas y días de lunes a domingo como filas.
   La semana actual conserva las filas futuras como celdas vacías. Cubre RF-1.
3. Cada celda comunica la fecha y el nivel por texto accesible, además de
   mostrar el nivel con un estilo visual diferenciado. Los cuatro niveles usan
   intensidades de la paleta azul actual y etiquetas textuales en la leyenda.
   Cubre RF-3 y los requisitos no funcionales de accesibilidad.
4. Al apuntar o enfocar una celda se ofrece fecha local, minutos diarios y
   cantidad de sesiones. Las celdas de días sin sesiones informan cero minutos
   y cero sesiones. Cubre RF-2 y RF-6.
5. Las celdas deben poder enfocarse con teclado y mostrar foco perceptible. Al
   tocar una celda se muestra su detalle; tocar otra actualiza el detalle.
   Cubre RF-6.
6. Si el periodo no contiene sesiones, se conserva la cuadrícula sin actividad
   y se muestra una invitación en español para registrar una sesión. Cubre
   RF-5.
7. El texto del usuario, incluidos valores usados en detalles, se inserta con
   `textContent`; no se utiliza `innerHTML`. El mapa no presenta acciones que
   borren o modifiquen sesiones. Cubre RF-2 y los requisitos de conservación y
   seguridad.
8. Los estilos deberán mantener legibilidad a 375 px sin desbordamiento
   horizontal ni recorte de contenido. La comprobación se realizará en
   navegador, además de los tests de lógica.

## Decisiones técnicas justificadas

| Decisión del plan | Justificación | Alternativa descartada |
|---|---|---|
| Mantener HTML, CSS y JavaScript nativos, sin dependencias ni compilación. | Cumple el principio de simplicidad y conserva la apertura directa de la aplicación. | Incorporar una biblioteca de gráficos, un framework o un paso de build. |
| Hacer que los cálculos vivan en funciones puras que reciben `today`. | Permite resultados deterministas, pruebas con fechas fijadas y separación entre cálculo e interfaz. | Calcular fechas y niveles directamente en el DOM o leer `new Date()` dentro de la lógica. |
| Derivar el mapa desde las sesiones existentes y no guardar métricas o niveles. | Evita duplicar estado y conserva la compatibilidad con los datos actuales. | Persistir agregados diarios o intensidades junto con las sesiones. |
| Agregar minutos y sesiones por fecha antes de calcular intensidades. | Aplica el requisito de que varias sesiones del día cuentan juntas y permite informar su cantidad. | Asignar una celda por sesión o calcular el nivel por sesión individual. |
| Excluir fechas posteriores a `today` antes de sumar y obtener el máximo. | Impide que sesiones futuras influyan en los valores o niveles del mapa. | Incluirlas en los totales y ocultarlas solo al final del renderizado. |
| Usar celdas semánticas y enfocables, con detalle textual además del color. | Hace consultable el nivel mediante teclado y no depende exclusivamente de la percepción del color. | Dibujar el mapa como imagen o comunicar niveles únicamente con color. |
| Usar semanas como columnas, días como filas, cuatro intensidades azules y detalle táctil. | Son las decisiones ya confirmadas e incorporadas a la spec en T1. | Elegir otra distribución, paleta o interacción durante la implementación. |

## Estrategia de tests con `node --test`

### Pruebas de funciones puras

En `tests/heat-map.test.js`, importar las funciones de `logic.js` y probar con
fechas fijas; ninguna prueba dependerá del reloj real, la zona UTC ni el DOM.

- **RF-1 — periodo:** comprobar que el inicio es el lunes local de hace 11
  semanas y que el final es `today`, ambos incluidos; comprobar lunes y domingo
  como valores de `today` y el orden de días de lunes a domingo.
- **RF-1 — cambio de calendario:** comprobar el recorrido del periodo al cruzar
  fin de mes, fin de año y año bisiesto, sin saltos ni días duplicados.
- **RF-2 — sesiones repetidas:** comprobar que sesiones de la misma fecha
  producen una entrada, suman todos sus minutos y cuentan todas las sesiones.
- **RF-2 — días vacíos:** comprobar cero minutos, cero sesiones y nivel “sin
  actividad”.
- **RF-3 — clasificación:** verificar valores exactos e inmediatamente por
  debajo/encima del 25 %, 50 % y 75 %, además del máximo; verificar máximo cero.
- **RF-4 — fechas futuras:** comprobar que se excluyen sesiones futuras de los
  minutos, del número de sesiones y del máximo, y que una sesión de mañana no
  crea actividad.
- **RF-4 — huecos:** comprobar que un día sin sesiones entre fechas con sesiones
  queda sin actividad, sin afectar la agregación de los otros días.
- **RF-5 — periodo vacío:** con cero sesiones y con sesiones exclusivamente
  fuera del periodo, comprobar que todos los días del periodo resultan vacíos.
- **Fechas locales:** comprobar construcción de día con componentes locales y
  avance usando días calendario, incluyendo una transición de mes/año.
- **Datos de entrada inválidos:** comprobar que una fecha local inválida se
  excluye del cálculo del mapa sin modificar las sesiones guardadas, tal como
  establece RF-2.

Ejecutar `node --test` y no continuar a integración si alguna prueba falla.
La batería cubre como mínimo las categorías constitucionales: varias sesiones
el mismo día, fechas futuras, huecos y cambios de mes o año.

### Verificación de interfaz

La verificación manual se realiza al completar las tareas de interfaz:

- Abrir `index.html` directamente y comprobar que el mapa aparece sin errores
  de consola ni dependencias remotas.
- Con una sesión en una fecha conocida, comprobar nivel, fecha, minutos y
  cantidad de sesiones; repetir con varias sesiones el mismo día.
- Comprobar el estado sin sesiones y sesiones solamente fuera del periodo.
- Recorrer las celdas con teclado y verificar foco visible y detalle equivalente
  al nivel de color.
- Comprobar en 375 px que no hay desbordamiento horizontal ni texto recortado.
- Probar la interacción táctil aprobada en la spec: tocar una celda y luego
  otra para comprobar que el detalle se actualiza.
- Confirmar que guardar y volver a cargar no cambia ni pierde las sesiones
  existentes.

No quedan decisiones de producto pendientes que bloqueen la implementación.
Las tareas T5–T10 separan el marcado, los estilos, la integración y la
verificación para conservar la funcionalidad existente en cada etapa.
