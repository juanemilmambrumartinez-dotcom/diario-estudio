# Constitución — Diario de Estudio

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **Simplicidad primero**: HTML, CSS y JS puros. Sin dependencias ni build.
   Funciona abriendo index.html con doble clic. Los únicos archivos permitidos
   son los de la app, la lógica y los tests.
2. **La spec manda**: nada se implementa si no está en la spec activa.
   Si falta una decisión, se para y se pregunta.
3. **Lógica separada de interfaz**: los cálculos (fechas, rachas, estadísticas)
   viven en un archivo propio como funciones puras, sin DOM ni localStorage,
   que reciben "hoy" como parámetro.
4. **Tests como puerta**: la lógica se prueba con `node --test`, sin instalar
   paquetes. Deben cubrir al menos: varias sesiones el mismo día, fechas
   futuras, huecos en el historial y cambio de mes o año.
   Prohibido avanzar con tests en rojo.
5. **Los datos del usuario son sagrados**: localStorage con compatibilidad hacia
   atrás. Fechas como texto "AAAA-MM-DD" en hora local; nunca `toISOString()`
   ni `new Date("AAAA-MM-DD")`. Nunca se pierde una sesión.
6. **Idioma**: código en inglés; interfaz y documentación en español.
7. **Seguridad básica**: el texto del usuario se muestra con `textContent`,
   nunca con `innerHTML`.

**Cambios a esta constitución**: solo con decisión explícita del autor, anotando
qué cambió y por qué..