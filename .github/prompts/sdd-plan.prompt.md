---
description: SDD · Genera el plan técnico de una spec aprobada
agent: agent
---
NO escribas código. Usa la skill sdd. Lee [la constitución](../../docs/constitution.md), [AGENTS.md](../../AGENTS.md) y la spec indicada después del comando.

Si la spec no está aprobada o tiene dudas abiertas, para y avísame.

Crea SOLO specs/<carpeta>/plan.md con: archivos que se crean o modifican y la responsabilidad de cada uno, funciones puras (con "hoy" como parámetro), algoritmo en pseudocódigo, cómo se pinta en la interfaz, decisiones técnicas justificadas con su alternativa descartada (incluye cómo se carga la lógica tanto en el navegador con doble clic como en node --test, respetando la constitución) y estrategia de tests.

Todo debe respetar la constitución y cubrir todos los RF; marca qué RF cubre cada parte. Si falta una decisión, márcala como [NECESITA ACLARACIÓN] y pregúntame. No pases a las tareas hasta que apruebe el plan.