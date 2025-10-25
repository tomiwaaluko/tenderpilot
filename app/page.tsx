import Link from "next/link";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <Nav />
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">⚖️ TenderPilot</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          AI-powered legal operations assistant with human-in-the-loop workflow.
          Classify messages, orchestrate specialist agents, and maintain full
          audit trails.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link
            href="/inbox"
            className="block p-6 border rounded-xl hover:shadow-lg transition-shadow bg-white"
          >
            <div className="text-3xl mb-3">📨</div>
            <h2 className="text-xl font-semibold mb-2">Inbox</h2>
            <p className="text-gray-600 text-sm">
              Submit and classify client messages for processing
            </p>
          </Link>

          <Link
            href="/tasks"
            className="block p-6 border rounded-xl hover:shadow-lg transition-shadow bg-white"
          >
            <div className="text-3xl mb-3">🚀</div>
            <h2 className="text-xl font-semibold mb-2">Tasks</h2>
            <p className="text-gray-600 text-sm">
              Dispatch pending tasks to specialist agents
            </p>
          </Link>

          <Link
            href="/approvals"
            className="block p-6 border rounded-xl hover:shadow-lg transition-shadow bg-white"
          >
            <div className="text-3xl mb-3">✅</div>
            <h2 className="text-xl font-semibold mb-2">Approvals</h2>
            <p className="text-gray-600 text-sm">
              Review and approve proposed agent actions
            </p>
          </Link>

          <Link
            href="/audit"
            className="block p-6 border rounded-xl hover:shadow-lg transition-shadow bg-white"
          >
            <div className="text-3xl mb-3">📋</div>
            <h2 className="text-xl font-semibold mb-2">Audit Log</h2>
            <p className="text-gray-600 text-sm">
              View complete timeline of all system actions
            </p>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-xl">
          <h3 className="font-semibold mb-2">🧪 Testing with Mock Data</h3>
          <p className="text-sm text-gray-700 mb-3">
            Currently running in{" "}
            <code className="bg-white px-2 py-1 rounded">
              TP_USE_MOCKS=true
            </code>{" "}
            mode. Visit the{" "}
            <Link
              href="/mock-portal"
              className="text-blue-600 hover:underline font-medium"
            >
              Mock Portal
            </Link>{" "}
            to simulate external systems.
          </p>
        </div>
      </div>
    </main>
  );
}
