---
description: SDD · Implementa UNA tarea (uso: /sdd-implement 002-nombre T3)
agent: agent
---
Usa la skill sdd. Lo que escribí después del comando es: la carpeta de la spec y el número de tarea. Lee [la constitución](../../docs/constitution.md), [AGENTS.md](../../AGENTS.md), el plan y la tarea indicada en tasks.md. Implementa SOLO esa tarea.

1. Verifica que las tareas de las que depende estén marcadas como hechas. Si no, para y avísame.
2. Si la tarea es de lógica: escribe primero los tests, ejecuta node --test y muéstrame la salida completa EN ROJO. Luego escribe el código mínimo para que pasen y muéstrame la salida completa. No modifiques los tests para que pasen: si un test parece incorrecto, para y dime por qué.
3. Si la tarea es de interfaz (sin tests): no dañes lo que ya existe (formulario, lista, rachas, borrado, localStorage). Ejecuta node --test al final: debe seguir en verde.
4. No toques archivos fuera de los que lista la tarea. Si la spec, el plan y la tarea se contradicen, para y pregúntame.

Al terminar: marca la tarea en tasks.md, actualiza MEMORY.md, indica qué RF cubre, qué NO pudiste comprobar, y PÁRATE. No empieces la siguiente.