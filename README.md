# 🧠 **TenderPilot — AI Legal Ops Platform**

> **Human-in-the-Loop AI Assistant for Legal Operations**

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange)

---

## 🚀 Overview

**TenderPilot** is a next-generation AI platform for legal case management — built using Google’s **Agent Development Kit (ADK)** principles.
It demonstrates advanced **multi-agent orchestration**, **parallel processing**, and **agent-to-agent (A2A)** communication for streamlined legal workflows.

At its core, TenderPilot transforms chaotic client communications into clean, actionable tasks that legal teams can approve and execute with confidence.

---

## ⚙️ Key Features

### 🤖 Multi-Agent Orchestration

* **Evidence Sorter Agent** — Extracts and structures billing or medical records.
* **Client Communications Agent** — Drafts empathetic and professional client updates.
* **Classifier Agent** — Routes new messages to the correct specialists.
* **Orchestrator** — Dispatches all AI agents **in parallel**, tracking every step.

### 🧍 Human-in-the-Loop Workflow

* **Approval System** — Attorneys review AI proposals before execution.
* **Confidence Scoring** — Displays the model’s certainty on each task.
* **Execution Preview** — See exactly what the AI intends to do before confirming.

### 📈 Real-Time Monitoring

* **Audit Timeline** — Every decision logged for transparency.
* **Telemetry Dashboard** — Live metrics for tasks, handoffs, and loop ticks.
* **Task Watcher** — Continuous background monitoring for new messages.

### 🧩 Modern UI / UX

* Gradient-based design (Blue → Purple)
* Framer Motion animations
* Lucide icons + TailwindCSS responsive layout

---

## 🧱 ADK Patterns Implemented

| Pattern                  | Description                                 | How It Works                                            |
| ------------------------ | ------------------------------------------- | ------------------------------------------------------- |
| 🔀 **Parallelism**       | Multiple agents run concurrently            | Evidence Sorter + Client Comms execute in parallel      |
| 🤝 **A2A Communication** | Agents share knowledge between runs         | Client Comms imports the latest Evidence Sorter results |
| 🔄 **Continuous Loop**   | Background monitoring & auto-classification | Watcher pings `/api/loop/tick` every few seconds        |

---

## 🏗️ System Architecture

```
┌──────────────┐
│   Inbox      │
└───────┬──────┘
        │
        ▼
┌──────────────┐
│ Classifier   │
└──────┬───────┘
       │
┌──────┴─────────────┐
│  Parallel Agents    │
│  (Evidence & Comms) │
└──────┬──────────────┘
       │
       ▼
┌──────────────┐
│  Approvals   │
└──────┬───────┘
       ▼
┌──────────────┐
│  Execution   │
└──────────────┘
```

---

## 🧩 Tech Stack

**Frontend**

* Next.js 16 (App Router)
* React 19.2
* TypeScript
* TailwindCSS v4
* Framer Motion
* Lucide React

**Backend**

* Next.js API Routes
* Supabase (PostgreSQL)
* Google Gemini 2.5 Pro

**Infrastructure**

* Vercel (deployment)
* Supabase Cloud (DB + hosting)

---

## ⚡ Getting Started

### Prerequisites

* Node.js 18+
* Supabase project ([app.supabase.com](https://app.supabase.com))
* Google Gemini API key ([aistudio.google.com](https://aistudio.google.com/app/apikey))

### Installation

```bash
git clone https://github.com/tomiwaaluko/tenderpilot.git
cd tenderpilot
npm install
```

### Environment Setup

Create `.env.local`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
TP_USE_MOCKS=false
```

> 💡 **Tip:** During testing, set `TP_USE_MOCKS=true` to use mock Gemini outputs.

### Start the Server

```bash
npm run dev
# open http://localhost:3000
```

---

## 🧠 Usage Guide

### 1. **Submit a Message** → `/inbox`

Paste a case ID and client message (email/text).
TenderPilot classifies and creates structured tasks.

### 2. **Start Watcher** → `/tasks`

Enables the continuous ADK loop.
Automatically detects new messages and classifies them.

### 3. **Run Orchestrator**

Dispatches agents **in parallel** (Evidence Sorter + Client Comms).
Creates a `parallel_dispatch` entry in the audit log.

### 4. **Review & Approve** → `/approvals`

Attorneys approve AI-generated proposals.
Client Comms uses **A2A handoff** from Evidence Sorter.

### 5. **Monitor Everything**

* `/audit` → Action timeline (loop ticks, handoffs, dispatches)
* `/telemetry` → Live metrics for ADK activity

---

## 🧪 Testing (Quick Validation)

```bash
# Create a new message
curl -X POST http://localhost:3000/api/ingest \
  -F "caseId=case-101" \
  -F "text=Client sent new bills from Orlando Health"

# Run orchestrator
curl -X POST http://localhost:3000/api/orchestrator/run

# Simulate watcher loop
curl -X POST http://localhost:3000/api/loop/tick
```

Check `/audit` for:

* `parallel_dispatch`
* `a2a_handoff`
* `loop_tick`

---

## 📊 Telemetry Metrics

| Metric                                       | Description                     |
| -------------------------------------------- | ------------------------------- |
| **Pending / Proposed / Approved / Executed** | Task pipeline counts            |
| **Parallel Dispatches**                      | Number of ADK multi-agent runs  |
| **A2A Handoffs**                             | Agent-to-agent data transfers   |
| **Last Loop Tick**                           | Time of last watcher activation |

---

## 🧾 Project Structure

```
app/
 ├── api/
 │   ├── agents/
 │   │   ├── client-comms/       # Client communication agent
 │   │   └── evidence-sorter/    # Evidence extraction agent
 │   ├── classify/               # Message classification
 │   ├── ingest/                 # Message ingestion
 │   ├── loop/tick/              # Continuous watcher
 │   └── orchestrator/run/       # Parallel dispatcher
 ├── inbox/                      # Inbox UI
 ├── tasks/                      # Orchestration dashboard
 ├── approvals/                  # Human review UI
 ├── audit/                      # System timeline
 └── telemetry/                  # ADK metrics dashboard
```

---

## 🧰 Troubleshooting

| Issue                  | Fix                                      |
| ---------------------- | ---------------------------------------- |
| **“Ingest failed”**    | Check Supabase connection + disable RLS  |
| **“Gemini API error”** | Verify `GEMINI_API_KEY` or use mocks     |
| **Tasks missing**      | Ensure classification + orchestrator ran |
| **Watcher inactive**   | Confirm `/api/loop/tick` returns 200     |
| **Telemetry empty**    | Run through one full workflow first      |

---

## 🌐 Deployment (Vercel)

1. Push to GitHub:

   ```bash
   git push origin main
   ```
2. Import to [Vercel](https://vercel.com)
3. Add `.env` variables under project settings
4. Deploy → open `https://your-domain.vercel.app`

---

## 🤝 Contributing

Pull requests are welcome!
Follow standard TypeScript + ESLint rules, commit semantically, and document new routes or agents.

---

## 🧭 Roadmap

| Phase                  | Features                              | Status |
| ---------------------- | ------------------------------------- | ------ |
| **1. Core System**     | Classification, Approvals, Telemetry  | ✅      |
| **2. ADK Integration** | Parallel Agents, A2A, Continuous Loop | ✅      |
| **3. Future**          | Auth, File Uploads, Analytics, Tests  | 🚧     |

---

## 🔐 Security

**Development:**

* RLS disabled for demo simplicity
* API keys stored safely in `.env.local`

**Production:**

* Enable RLS
* Add authentication (NextAuth.js)
* Enforce HTTPS
* Rate-limit endpoints

---

## 🏆 Credits & Acknowledgments

* **Google Gemini** — LLM powering intelligent classification
* **Supabase** — Realtime database and backend
* **Vercel** — Hosting & deployment
* **Next.js Team** — Framework excellence

---

## 💡 Built For

> **Google AI Hackathon 2025** — Showcasing multi-agent ADK architecture in real legal workflows.
> *“Human judgment + AI efficiency = Better justice.”*

*Last updated: **October 26, 2025***
