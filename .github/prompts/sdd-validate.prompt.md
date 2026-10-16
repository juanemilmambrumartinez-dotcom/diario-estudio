---
description: SDD · Valida la spec RF por RF (tests + Chrome DevTools)
agent: agent
---
Usa la skill sdd. NO modifiques ningún archivo ni arregles nada: solo comprueba e informa. Lee [la constitución](../../docs/constitution.md) y la spec indicada después del comando.

1. Comprueba primero que todas las tareas de tasks.md estén marcadas. Si faltan, dilo antes de seguir.
2. Ejecuta node --test y muéstrame la salida completa.
3. Recorre cada RF: cómo se comprobó (test o Chrome DevTools), resultado PASÓ / FALLÓ / NO VERIFICADO y evidencia breve.
4. Los RF de interfaz, verifícalos con Chrome DevTools abriendo solo index.html: escritorio y 375 px (sin desbordamiento horizontal ni texto cortado), teclado y toque, y sin errores en la consola.
5. Comprueba casos límite, criterios de finalización y reglas de la constitución. Deja el localStorage de prueba limpio.

Entrega una tabla RF | verificación | resultado | evidencia, y el veredicto: ¿la spec está cumplida? Lista claramente lo que falló o no pudiste comprobar.