---
titulo: "Nova"
slug: nova
idioma: en
resumen: "My own AI agent, built without agent frameworks, running on my computer: it manages my calendar and files and reminds me of what's pending. The hardest part was getting a small model to answer fast without claiming it had done things it hadn't."
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
portada:
    src: "./portada.png"
    alt: "A conversation in Nova: I ask it to remind me around 11 that I need to pick up the car from the garage, and it replies that it will let me know at 11:00."
destacado: true
orden: 1
borrador: false
---

I always forget the things I have pending, and reminder apps don't work for me: they're so rigid that my brain gets used to them and stops seeing them. So I built myself a personal secretary. Nova runs on my computer, and every so often an internal clock goes off. Following a set of guidelines it interprets on its own, it decides whether to bring up something I have pending or stay quiet.

The model and the voice run on Python: faster-whisper to understand me, openWakeWord for a custom wake word and Gemma 4 as the model, all local. The desktop app is built in C# with WinUI 3 and the Android one in Kotlin, and tasks sync between them through Firestore. I don't use agent frameworks because I needed things they didn't give me: approving from my phone what it's about to do, cancelling it by voice, restarting on its own if the model goes down, and answering on desktop, phone and voice at the same time.

The hardest part was getting a fast, honest chat out of a small model. At first I used Antigravity CLI, and a turn with one tool call took about 100 seconds. Just to answer "ok" it sent almost 17,000 tokens of its own prompt, and it reused the same conversation until it reached 43,000. With my own orchestrator, a turn takes 1.9 seconds with the model loaded.

Then it had to stop lying. A 12B model sometimes says it has done things it hasn't, so I built an evaluation with 28 real cases and a "lies" column, and tested four models. Gemma 4 won, and even so it promised me "I'll remind you at 12:15" without touching the task. The guard that catches this took three attempts. The first only recognised sentences in the past tense. The second left the model silent for 20 seconds. The one that works asks it for the action again, quoting back what it said and without letting it reason, and it did it 6 out of 6 times.

Right now it's a prototype I use every day on my PC. I still need to test the Android app more thoroughly on my phone, finish sign-in, make it listen only to me, and separate reading email and the web from taking actions, for security.
