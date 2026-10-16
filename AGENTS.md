# Instrucciones para agentes

## Proyecto
- Proyecto de aprendizaje: ejercicios de C# y la web "Diario de Estudio".
- Explica siempre en español, con soluciones claras para alguien que está empezando.
- Haz cambios pequeños. No reescribas ejemplos ni añadas funciones que no se pidieron.

## Fuente de verdad (Diario de Estudio)
1. `docs/constitution.md`: reglas innegociables. Si algo de este archivo las
   contradice, manda la constitución.
2. `specs/NNN-*/`: la spec activa. Nada se implementa si no está ahí.
3. `MEMORY.md`: estado, decisiones y errores a evitar.

Lee los tres antes de tocar código de la web. Si falta una decisión, para y pregunta.

## C#
- `money1.csproj` usa .NET 10, referencias implícitas y nullable habilitado; sin paquetes externos.
- Los `.cs` del árbol se incluyen por defecto. Al añadir código en `learning/` o `app/`, comprueba el proyecto completo.
- Construir: `dotnet build money1.csproj`. Ejecutar: `dotnet run --project money1.csproj`.

## Web (Diario de Estudio)
- Archivos: `index.html`, `styles.css`, `app.js`, `logic.js` (cálculos puros) y `tests/`.
- Sin frameworks, librerías ni build. Se abre `index.html` con doble clic.
- Interfaz y documentación en español; código en inglés.
- Fechas como `"AAAA-MM-DD"` en hora local. Nunca `toISOString()` ni `new Date("AAAA-MM-DD")`.
  Construir con `new Date(año, mes - 1, día)` y mover días con `setDate()`.
- Texto del usuario con `textContent`.
- Las rachas se calculan desde las sesiones; no se guardan contadores derivados.
  Cuentan fechas únicas y excluyen fechas futuras.
- Confirmar antes de borrar una sesión y localizarla en el arreglo original, no por su posición en la lista ordenada.

## Flujo de trabajo
1. Plan primero: qué archivos cambiarás y qué dudas hay. No modifiques nada hasta que se apruebe.
2. Implementa solo lo que pide la spec.
3. Validación:
   - Web: `node --test` en verde (no avances con tests en rojo) y prueba manual en el navegador.
   - C#: `dotnet build money1.csproj`.
4. Si no puedes ejecutar una comprobación, indícalo. No presentes como verificado lo que solo inferiste.

## Límites
No instales paquetes, no borres archivos ni ejecutes comandos destructivos sin pedirlo antes.
No cambies la constitución ni la spec por tu cuenta.

## Memoria
- Al empezar, lee `MEMORY.md`.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su porqué) y errores a evitar.
- Máximo ~50 líneas: resume o elimina lo que ya no aporte.
- Si algo se vuelve regla permanente, propón moverlo a `AGENTS.md` en lugar de dejarlo en la memoria.
- Nunca guardes datos sensibles (claves, tokens, datos personales).