---
name: sdd
description: "Úsala siempre que trabajes con Spec-Driven Development en este proyecto (docs/constitution.md o cualquier archivo dentro de specs/) - redactar, revisar o cambiar specs, planes y tareas, o implementar y validar tareas de una spec."
---

# Spec-Driven Development (SDD)

Flujo: Constitución → Spec → Clarificación → Plan → Tareas → Implementación → Validación → Cambio.

## Reglas
- Nunca pases a la siguiente fase sin mi aprobación explícita.
- La spec manda: si algo no está en la spec, no se implementa. Si falta una decisión, para y pregunta; no la inventes.
- Las decisiones aprobadas se incorporan a spec.md ANTES de planificar. tasks.md no guarda decisiones pendientes.
- Un cambio de requisitos va primero a la spec, luego al plan y las tareas, y por último al código.
- Cada spec vive en specs/NNN-nombre/ con spec.md, plan.md y tasks.md. Solo se crea o modifica el archivo de la fase en curso.
- Si algo contradice docs/constitution.md, manda la constitución.
- Al terminar cada fase, actualiza MEMORY.md.
- Indica siempre qué NO pudiste comprobar. Nunca presentes como verificado lo que solo inferiste.

## Spec (spec.md)
Describe el QUÉ y el POR QUÉ: nada de stack, arquitectura ni nombres de archivos.
Secciones: Estado (borrador | aprobada | implementada), Contexto y objetivo, Usuarios, Historias de usuario (HU-n), Definiciones (solo si hay términos ambiguos), Requisitos funcionales, Requisitos no funcionales, Casos límite, Fuera de alcance, Criterios de finalización, Dudas abiertas ([NECESITA ACLARACIÓN]).

Requisitos en EARS, en español:
- RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.
- RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.
- RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.
- RF-x: EL SISTEMA <comportamiento permanente>.
Cada RF debe poder comprobarse con una prueba concreta. Nada de "rápido", "intenso" o "se ve bien" sin criterio medible.

## Plan (plan.md)
Archivos y responsabilidades · Funciones puras (con "hoy" como parámetro) · Algoritmo en pseudocódigo · Interfaz · Decisiones justificadas con su alternativa descartada (incluye cómo se carga la lógica en el navegador y en node --test) · Estrategia de tests. Marca qué RF cubre cada parte.

## Tareas (tasks.md)
Formato de cada tarea:
- [ ] **Tn. Título**
  - Depende de: Tx o ninguna
  - Archivos que toca:
  - RF que cubre:
  - Tests: qué se escribe primero (o "no aplica" en tareas de interfaz)
  - Hecho cuando: comprobación verificable (comando y resultado esperado)
Máximo 20-30 min por tarea, en orden de dependencia, sin dejar la app rota. Lógica primero, interfaz después. Termina con una tabla RF → tareas. Si salen más de 10, propón dividir la spec.

## Implementación
Una sola tarea cada vez. Si es de lógica: tests primero, en rojo; después el código; node --test en verde. Si es de interfaz: comprobación manual. Nunca modifiques un test para que pase. Marca la tarea y para.

## Validación
Solo comprueba e informa, sin arreglar. Cada RF termina en PASÓ, FALLÓ o NO VERIFICADO, con evidencia.