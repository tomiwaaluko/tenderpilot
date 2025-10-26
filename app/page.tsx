import Link from "next/link";
import Header from "@/components/Header";
import {
  Inbox,
  Rocket,
  CheckCircle,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Legal Operations</span>
          </div>
          <h1 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to TenderPilot
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your intelligent legal operations assistant with human-in-the-loop
            workflow. Classify messages, orchestrate specialist agents, and
            maintain full audit trails with confidence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/inbox"
            className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-blue-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
            <div className="relative">
              <div className="bg-blue-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Inbox className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">Inbox</h2>
              <p className="text-gray-600 mb-4">
                Submit and classify client messages for intelligent processing
                by AI agents
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <span>Get started</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/tasks"
            className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-purple-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-purple-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
            <div className="relative">
              <div className="bg-purple-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Rocket className="w-7 h-7 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">Tasks</h2>
              <p className="text-gray-600 mb-4">
                Dispatch pending tasks to specialist AI agents for automated
                processing
              </p>
              <div className="flex items-center text-purple-600 font-medium">
                <span>Manage tasks</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/approvals"
            className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-green-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
            <div className="relative">
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                Approvals
              </h2>
              <p className="text-gray-600 mb-4">
                Review and approve proposed agent actions before execution
              </p>
              <div className="flex items-center text-green-600 font-medium">
                <span>Review proposals</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/audit"
            className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-gray-500 transition-all hover:shadow-xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
            <div className="relative">
              <div className="bg-gray-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-7 h-7 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">
                Audit Log
              </h2>
              <p className="text-gray-600 mb-4">
                View complete timeline of all system actions and decisions
              </p>
              <div className="flex items-center text-gray-600 font-medium">
                <span>View history</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Mock Mode Banner */}
        <div className="bg-linear-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-gray-900">
                Testing with Mock Data
              </h3>
              <p className="text-gray-700 mb-3">
                Currently running in{" "}
                <code className="bg-white px-2 py-1 rounded border border-gray-300 font-mono text-sm">
                  TP_USE_MOCKS=true
                </code>{" "}
                mode. Perfect for testing without external dependencies.
              </p>
              <Link
                href="/mock-portal"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span>Open Mock Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
