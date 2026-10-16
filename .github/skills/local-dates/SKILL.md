---
name: local-dates
description: Reglas para trabajar con fechas, días, semanas y rachas en el Diario de Estudio usando siempre la hora local, nunca UTC. Úsala siempre que escribas, modifiques o revises código que obtenga la fecha de hoy, compare o sume días, calcule la semana, la racha actual, la mejor racha o valide fechas del formulario.
---

# Fechas locales en el Diario de Estudio

Las fechas son la mayor fuente de bugs de este proyecto. Sigue esta guía siempre que toques código con fechas.

## Reglas

1. **Formato**: las fechas se guardan y se comparan como texto "AAAA-MM-DD" en la zona horaria local. Con ceros a la izquierda, comparar textos con < y > equivale a comparar fechas.
2. **Hoy**: construye el texto con getFullYear(), getMonth() + 1 y getDate(), rellenando con ceros (padStart).
3. **Texto a fecha**: separa año, mes y día y usa new Date(año, mes - 1, día). Nunca new Date("AAAA-MM-DD"): se interpreta en UTC y puede dar el día anterior.
4. **Validar**: tras crear la fecha, comprueba que año, mes y día coinciden con lo recibido. Así se rechaza "2026-02-31", que JavaScript convertiría en marzo sin avisar.
5. **Sumar o restar días**: copia la fecha y usa setDate(getDate() ± n). Nunca milisegundos (86400000): un día no siempre dura 24 h.
6. **Semana**: va de lunes a hoy. El lunes de una fecha es getDate() - ((getDay() + 6) % 7), porque getDay() devuelve 0 en domingo.
7. **Fechas futuras**: no cuentan en la racha actual, la mejor racha ni el total semanal.
8. **Varias sesiones el mismo día**: cuentan como un solo día para las rachas, pero sus minutos sí se suman.
9. **Reutilizar**: antes de crear una función de fechas, busca en app.js si ya existe una. Nunca dupliques lógica de fechas.

## Prohibido

- toISOString() para obtener el día: devuelve UTC.
- new Date("AAAA-MM-DD").
- Cálculos con 86400000.

## Checklist de revisión

- [ ] ¿Hay algún toISOString(), new Date("AAAA-MM-DD") o 86400000?
- [ ] ¿Qué pasa con una sesión registrada de noche (21:00 o 23:30)? En UTC-4 ya es "mañana" en UTC desde las 20:00.
- [ ] ¿Qué pasa en el cambio de hora en países con horario de verano?
- [ ] ¿Se rechazan fechas inválidas como 2026-02-31?
- [ ] ¿Se ignoran las fechas futuras donde corresponde?
- [ ] ¿La semana empieza el lunes, incluso si hoy es domingo?

## Al terminar

Indica qué puntos del checklist comprobaste y cómo. Si alguno no se pudo probar, dilo en lugar de darlo por bueno.