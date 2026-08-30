# Learnora — AI Learning Companion

> **Learn anything. Understand it deeply.**

Learnora is an evidence-grounded AI learning companion that transforms a user's question into a structured learning experience using Retrieval-Augmented Generation (RAG).

Instead of relying only on an LLM's internal knowledge, Learnora retrieves relevant information from user-provided documents and uses that evidence to generate the lesson.

If sufficiently relevant evidence is not available, Learnora refuses to provide a confident answer.

---

## ✨ Features

- 🤖 AI-powered learning with Llama 3.2
- 🔎 Semantic document retrieval
- 📚 Retrieval-Augmented Generation (RAG)
- 🛡️ Grounding verification
- 🚫 Safe refusal when evidence is insufficient
- 📄 PDF, DOCX, TXT and Markdown support
- 🧠 Structured learning lessons
- 🌎 Real-world applications
- 💡 Practical examples
- ⚠️ Common mistakes
- ✦ Practice questions
- 📖 Evidence and source display
- 🗂️ Knowledge-base management
- 🗑️ Source deletion
- 🎨 Modern responsive web interface
- 🔒 Local-first development architecture

---

## 🧠 How Learnora Works

```text
                    User Question
                          │
                          ▼
                   FastAPI Backend
                          │
                          ▼
                  Semantic Retrieval
                          │
                          ▼
                Relevant Evidence Chunks
                          │
                          ▼
                     Llama 3.2
                          │
                          ▼
                  Structured JSON
                          │
                          ▼
                Grounding Verification
                          │
              ┌───────────┴───────────┐
              │                       │
          Supported              Insufficient
              │                       │
              ▼                       ▼
       Learning Lesson          Safe Refusal
              │
              ▼
       Sources & Evidence
              │
              ▼
          Learnora UI