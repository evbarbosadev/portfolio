---
titulo: "Nova"
slug: nova
idioma: es
resumen: "Un agente propio, sin frameworks de agentes, que funciona en mi ordenador: gestiona mi calendario y mis archivos y me recuerda lo que tengo pendiente. Lo más difícil ha sido que un modelo pequeño responda rápido y no diga que ha hecho cosas que no ha hecho."
rama: "Software"
periodo: "2026"
estado: activo
stack:
    - "Python"
    - "Gemma 4"
    - "faster-whisper"
    - "openWakeWord"
    - "C#"
    - "WinUI 3"
    - "Kotlin"
    - "Firestore"
portadaEnVivo: conversacion-de-nova
destacado: true
orden: 1
borrador: false
---

Siempre se me olvidan las cosas que tengo pendientes, y las apps de recordatorios no me sirven: son tan esquemáticas que mi cabeza se acostumbra y deja de verlas. Así que me he hecho un secretario personal. Nova funciona en mi ordenador y cada cierto tiempo salta un reloj interno. Con unas pautas que interpreta él mismo, decide si me comenta algo de lo que tengo pendiente o se calla.

El modelo y la voz van en Python: faster-whisper para entenderme, openWakeWord para una palabra de activación propia y Gemma 4 como modelo, todo en local. La app de escritorio está hecha en C# con WinUI 3 y la de Android en Kotlin, y las tareas se sincronizan entre las dos por Firestore. No uso frameworks de agentes porque necesitaba cosas que no me daban: aprobar desde el móvil lo que va a hacer, cancelarlo por voz, que se reinicie solo si el modelo se cae y que conteste a la vez en el escritorio, en el móvil y por voz.

Lo más difícil fue conseguir un chat rápido y honesto con un modelo pequeño. Al principio usaba Antigravity CLI y un turno con una herramienta tardaba unos 100 segundos. Solo para contestar «ok» mandaba casi 17.000 tokens de prompt propio, y reutilizaba la misma conversación hasta llegar a 43.000. Con mi propio orquestador, un turno tarda 1,9 segundos con el modelo cargado.

Después tocaba que no mintiera. Un modelo de 12B a veces dice que ha hecho cosas que no ha hecho, así que monté una evaluación con 28 casos reales y una columna de «mentiras», y probé cuatro modelos. Ganó Gemma 4, y aun así me prometió «te avisaré a las 12:15» sin tocar la tarea. La guardia que lo detecta me costó tres intentos. La primera solo reconocía frases en pasado. La segunda dejaba al modelo 20 segundos callado. La que funciona le vuelve a pedir la acción citándole lo que ha dicho, sin dejarle razonar, y la hizo 6 de 6 veces.

Ahora es un prototipo que uso a diario en el PC. Me falta probar más a fondo la app de Android en mi móvil, terminar el inicio de sesión, que solo me haga caso a mí y separar la lectura de correo y web de las acciones, por seguridad.
