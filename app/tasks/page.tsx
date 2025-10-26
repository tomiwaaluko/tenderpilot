"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { useToast } from "@/components/Toast";
import { motion } from "framer-motion";
import { Rocket, Zap, Brain } from "lucide-react";

// Tasks page: provides a simple button to trigger the orchestrator loop.
// In a full implementation this page would list all pending and
// proposed tasks, but for the demo we focus on dispatching tasks to
// their agents.

export default function Tasks() {
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  async function run() {
    setLoading(true);
    try {
      const res = await fetch("/api/orchestrator/run", { method: "POST" });
      const data = await res.json();
      push({
        title: "Orchestrator complete",
        description: `Dispatched ${data.dispatched} tasks`,
      });
    } catch (error) {
      push({
        title: "Orchestrator failed",
        description:
          error instanceof Error ? error.message : "Failed to dispatch tasks",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Rocket className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
              <p className="text-gray-600">Orchestrate specialist AI agents</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-8 border border-gray-200"
          >
            <div className="text-center max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-500 to-blue-500 rounded-full mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Orchestrator Control
                </h2>
                <p className="text-gray-600">
                  Trigger the orchestrator to dispatch pending tasks to
                  specialist agents. The system will analyze classified messages
                  and route them to the appropriate AI agents for processing.
                </p>
              </div>

              <motion.button
                type="button"
                onClick={run}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                className={`inline-flex items-center gap-3 rounded-xl px-8 py-4 font-semibold text-lg transition-all ${
                  loading
                    ? "opacity-50 cursor-not-allowed bg-gray-400 text-white"
                    : "bg-linear-to-r from-purple-600 to-blue-600 text-white hover:shadow-xl shadow-lg"
                }`}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    Working...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    Run Orchestrator
                  </>
                )}
              </motion.button>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-600 rounded-full"
                  />
                  <span>Processing tasks...</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
