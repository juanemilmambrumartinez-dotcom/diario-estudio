---
description: SDD · Entrevista y genera la spec (uso: /sdd-spec 002-nombre idea inicial)
agent: agent
---
NO escribas código en ningún momento. Usa la skill sdd. Lee [la constitución](../../docs/constitution.md), [AGENTS.md](../../AGENTS.md) y [MEMORY.md](../../MEMORY.md).

Lo que escribí después del comando es: primero el nombre de la carpeta (por ejemplo 002-nombre), y después la idea inicial. La spec va en specs/<esa carpeta>/.

1. Hazme preguntas de UNA en UNA, máximo 5, para eliminar ambigüedades: casos límite, errores o datos vacíos, y qué queda fuera de esta versión. Cada pregunta con 2 o 3 opciones y cuál recomiendas y por qué. Espera mi respuesta antes de la siguiente.
2. Respeta lo ya decidido en el proyecto (fechas locales, semana de lunes a hoy, fechas futuras excluidas, sesiones del mismo día suman minutos).
3. Con mis respuestas, crea SOLO specs/<carpeta>/spec.md con la plantilla de la skill, requisitos en EARS y "Estado: borrador". No modifiques otros archivos.
4. Solo el QUÉ y el POR QUÉ. Lo que falte, márcalo como [NECESITA ACLARACIÓN]; no lo inventes.