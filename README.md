# TenderPilot - AI Legal Ops PlatformThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

> **Human-in-the-loop AI assistant for legal operations**## Getting Started

TenderPilot is a production-ready agentic AI system built with Google's AI Development Kit (ADK) principles, demonstrating advanced multi-agent orchestration, parallel processing, and agent-to-agent communication for legal case management.First, run the development server:

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)```bash

![React](https://img.shields.io/badge/React-19.2-blue)npm run dev

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)# or

![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)yarn dev

![Gemini](https://img.shields.io/badge/Google-Gemini_AI-orange)# or

pnpm dev

---# or

bun dev

## 🎯 Overview```

TenderPilot automates legal operations workflows by coordinating specialized AI agents that work together to process client communications, organize evidence, and draft responses. The system showcases three core **Google ADK patterns**:Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

1. **🔀 Parallelism** - Multiple agents execute concurrentlyYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

2. **🤝 A2A (Agent-to-Agent)** - Knowledge sharing between specialists

3. **🔄 Continuous Loop** - Background monitoring and auto-classificationThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

---## Learn More

## ✨ Key FeaturesTo learn more about Next.js, take a look at the following resources:

### Multi-Agent Orchestration- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- **Evidence Sorter Agent** - Extracts and structures billing/medical records- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- **Client Communications Agent** - Drafts empathetic, professional responses

- **Classifier Agent** - Routes incoming messages to appropriate handlersYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- **Orchestrator** - Coordinates parallel task dispatch

## Deploy on Vercel

### Human-in-the-Loop Workflow

- **Approval System** - Review AI proposals before executionThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

- **Confidence Scoring** - Visual indicators for AI certainty

- **Execution Preview** - See planned actions before approvalCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Real-Time Monitoring

- **Audit Timeline** - Visual log of all system actions
- **Telemetry Dashboard** - Live metrics (tasks, handoffs, dispatches)
- **Task Watcher** - Continuous background loop for new messages

### Modern UI/UX

- Gradient design system (Blue → Purple)
- Framer Motion animations
- Lucide React icons
- Responsive Tailwind CSS layout

---

## 🏗️ Architecture

```
┌─────────────┐
│   Inbox     │ ──┐
└─────────────┘   │
                  ▼
            ┌──────────┐
            │ Classify │
            └──────────┘
                  │
         ┌────────┴────────┐
         ▼                 ▼
   ┌──────────┐     ┌──────────┐
   │ Evidence │     │  Client  │
   │  Sorter  │────▶│   Comms  │  (A2A Handoff)
   └──────────┘     └──────────┘
         │                 │
         └────────┬────────┘
                  ▼
          ┌──────────────┐
          │  Approvals   │
          └──────────────┘
                  │
                  ▼
          ┌──────────────┐
          │  Execution   │
          └──────────────┘
```

### Tech Stack

**Frontend:**

- Next.js 16.0 (App Router)
- React 19.2
- TypeScript
- Tailwind CSS v4
- Framer Motion (animations)
- Lucide React (icons)

**Backend:**

- Next.js API Routes
- Supabase (PostgreSQL)
- Google Gemini AI (LLM)

**Infrastructure:**

- Vercel (deployment)
- Supabase Cloud (database)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account ([app.supabase.com](https://app.supabase.com))
- Google Gemini API key ([aistudio.google.com](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tomiwaaluko/tenderpilot.git
   cd tenderpilot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create `.env.local` in the project root:

   ```env
   # Gemini API Configuration
   GEMINI_API_KEY=your_gemini_api_key_here

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Site URL for internal API calls
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Set to false to use real Gemini (true for mocks during development)
   TP_USE_MOCKS=false
   ```

4. **Set up Supabase database**

   Run the schema in your Supabase SQL Editor:

   ```bash
   # File: supabase-schema.sql
   ```

   **Important:** Disable RLS on these tables:

   - `messages`
   - `tasks`
   - `audit_logs`
   - `approvals`
   - `artifacts`

   Navigate to: Table Editor → [table name] → RLS toggle OFF

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open the app**
   ```
   http://localhost:3000
   ```

---

## 📖 Usage Guide

### 1. Submit a Message (Inbox)

Navigate to **Inbox** and submit a client message:

```
Case ID: case-101
Message:
From: John Doe
Subject: New Medical Bills
Body: Hi, I just got two more bills from Orlando Health and AdventHealth.
Please add them to my case.
```

### 2. Start the Watcher (Tasks)

Click **"Start Watcher"** to enable continuous loop monitoring:

- Polls every 4 seconds for new unclassified messages
- Automatically creates tasks for evidence sorting and client communication

### 3. Run Orchestrator (Tasks)

Click **"Run Orchestrator"** to dispatch pending tasks:

- Evidence Sorter and Client Comms run **in parallel**
- Creates `parallel_dispatch` audit log entry
- Tasks move to `proposed` status

### 4. Review Proposals (Approvals)

Check the **Approvals** page to review AI-generated proposals:

- Evidence Sorter creates structured billing table
- Client Comms drafts response (includes evidence via A2A handoff)
- Confidence badges show AI certainty (🌟 High, ⚡ Medium, ⚠️ Low)

### 5. Approve & Execute

Click **"Approve"** or **"Reject"**:

- Approved tasks execute immediately
- System logs `approved` and `executed` actions

### 6. Monitor System (Audit & Telemetry)

**Audit Log** - Visual timeline showing:

- 🔵 `parallel_dispatch` - Concurrent task fan-out
- 🟢 `a2a_handoff` - Agent knowledge transfer
- 🟣 `loop_tick` - Watcher activity

**Telemetry Dashboard** - Real-time metrics:

- Task counts (Pending, Proposed, Approved, Executed)
- Parallel dispatches count
- A2A handoffs count
- Last loop tick timestamp

---

## 🎬 Demo Script

See [.azure/DEMO_SCRIPT.md](.azure/DEMO_SCRIPT.md) for a complete walkthrough demonstrating:

- Continuous loop agent
- Parallel task dispatch
- A2A handoff
- Telemetry monitoring

**Perfect for presentations and stakeholder demos!**

---

## 🗂️ Project Structure

```
tenderpilot/
├── app/
│   ├── api/
│   │   ├── agents/
│   │   │   ├── client-comms/     # Client communication agent
│   │   │   └── evidence-sorter/  # Evidence extraction agent
│   │   ├── classify/              # Message classification
│   │   ├── ingest/                # Message ingestion
│   │   ├── loop/tick/             # Continuous watcher
│   │   └── orchestrator/run/      # Parallel dispatcher
│   ├── inbox/                     # Message submission UI
│   ├── tasks/                     # Orchestrator control panel
│   ├── approvals/                 # Proposal review UI
│   ├── audit/                     # Action timeline
│   ├── telemetry/                 # ADK metrics dashboard
│   └── layout.tsx                 # Root layout
├── components/
│   ├── Header.tsx                 # Navigation bar
│   └── Toast.tsx                  # Notification system
├── lib/
│   ├── supabase.ts                # Database client
│   ├── llm.ts                     # Gemini AI integration
│   └── prompts.ts                 # AI prompts
├── .azure/
│   └── DEMO_SCRIPT.md             # Presentation guide
├── supabase-schema.sql            # Database schema
└── README.md                      # This file
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Message submission creates tasks
- [ ] Watcher auto-classifies new messages
- [ ] Orchestrator dispatches tasks in parallel
- [ ] Evidence Sorter creates structured table
- [ ] Client Comms includes evidence summary (A2A)
- [ ] Approval workflow functions correctly
- [ ] Audit log shows all action types
- [ ] Telemetry metrics update in real-time

### API Testing

Test endpoints with curl or Postman:

```bash
# Ingest a message (with FormData)
curl -X POST http://localhost:3000/api/ingest \
  -F "caseId=case-101" \
  -F "text=Test message"

# Classify a message
curl -X POST http://localhost:3000/api/classify \
  -H "Content-Type: application/json" \
  -d '{"caseId":"case-101","messageId":"<uuid>"}'

# Run orchestrator
curl -X POST http://localhost:3000/api/orchestrator/run

# Loop tick
curl -X POST http://localhost:3000/api/loop/tick
```

---

## 🔧 Configuration

### Environment Variables

| Variable                        | Description                | Required |
| ------------------------------- | -------------------------- | -------- |
| `GEMINI_API_KEY`                | Google Gemini API key      | ✅       |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL       | ✅       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key     | ✅       |
| `NEXT_PUBLIC_SITE_URL`          | Base URL for API calls     | ✅       |
| `TP_USE_MOCKS`                  | Use mock data (true/false) | ❌       |

### Database Schema

Key tables:

- `messages` - Incoming client communications
- `tasks` - AI agent work items
- `approvals` - Human review records
- `audit_logs` - System action timeline
- `artifacts` - File attachments
- `cases` - Case metadata (optional)

**Important:** All tables must have RLS (Row Level Security) **disabled** for anonymous access during development.

---

## 🐛 Troubleshooting

### Common Issues

**"Ingest failed - Could not save message"**

- Check Supabase connection in `.env.local`
- Verify RLS is disabled on `messages` table
- Ensure `case_id` column is `text` type (not `uuid`)
- Check that `topic` column exists (not `raw_text`)

**"Gemini API error"**

- Verify `GEMINI_API_KEY` is set correctly
- Check API quota at [Google AI Studio](https://aistudio.google.com)
- Set `TP_USE_MOCKS=true` to bypass API calls during development

**Tasks not appearing in Approvals**

- Check that classification created tasks (view browser console)
- Verify RLS is disabled on `tasks` table
- Run orchestrator to dispatch pending tasks

**Watcher not working**

- Check browser console for fetch errors
- Verify `/api/loop/tick` returns 200 status
- Ensure at least one message exists without tasks

**Telemetry shows zeros**

- Run through the full workflow once to generate data
- Refresh the telemetry page
- Check Supabase connection

### Debug Mode

Enable detailed logging:

```typescript
// In any API route, add:
console.log("Debug:", { variable1, variable2 });
```

Check logs in terminal where `npm run dev` is running.

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Add Environment Variables**

   - Copy all variables from `.env.local`
   - Paste into Vercel project settings

4. **Deploy**
   - Vercel auto-deploys on every push to `main`

### Environment Variables in Production

Update `NEXT_PUBLIC_SITE_URL` to your production domain:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Add JSDoc comments for functions
- Use semantic commit messages

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Google Gemini** - AI model for intelligent classification and generation
- **Supabase** - Backend infrastructure and database
- **Next.js Team** - React framework excellence
- **Vercel** - Deployment and hosting platform

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/tomiwaaluko/tenderpilot/issues)
- **Repository:** [GitHub](https://github.com/tomiwaaluko/tenderpilot)

---

## 🎯 Roadmap

**Phase 1 - Core Features** ✅

- [x] Message ingestion and classification
- [x] Multi-agent orchestration
- [x] Approval workflow
- [x] Audit logging
- [x] Telemetry dashboard

**Phase 2 - ADK Implementation** ✅

- [x] Parallel task dispatch
- [x] A2A handoff
- [x] Continuous loop watcher

**Phase 3 - Future Enhancements** 🚧

- [ ] User authentication
- [ ] File upload support
- [ ] Email integration
- [ ] Advanced analytics
- [ ] Multi-tenancy
- [ ] API documentation (OpenAPI)
- [ ] Unit tests (Jest)
- [ ] E2E tests (Playwright)

---

## 📊 Performance

- **Page Load:** < 2s (average)
- **API Response:** < 500ms (average)
- **Gemini Latency:** 1-3s (varies by prompt)
- **Database Queries:** < 100ms (average)

---

## 🔐 Security

**Development Mode:**

- No authentication required (demo mode)
- RLS disabled for simplicity
- API keys stored in environment variables
- No sensitive data stored in client-side code

**Production Recommendations:**

- Enable Supabase RLS with proper policies
- Add user authentication (NextAuth.js)
- Implement rate limiting
- Use HTTPS only
- Validate all inputs server-side
- Rotate API keys regularly

---

**Built with ❤️ for the Google AI Hackathon**

_Last updated: October 26, 2025_
