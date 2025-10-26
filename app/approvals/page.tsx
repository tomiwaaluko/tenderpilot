"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  RefreshCw,
  Mail,
  Table,
  FileText,
  Sparkles,
} from "lucide-react";

interface TaskRow {
  id: string;
  case_id: string;
  type: string;
  status: string;
  assignee_agent: string;
  input: unknown;
  output: {
    summary?: string;
    citations?: string[];
    actions?: Array<{
      kind: string;
      data: Record<string, unknown>;
    }>;
  };
  confidence: number;
  created_at: string;
}

// Task type icons and colors
const taskTypeConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }
> = {
  evidence_sorter: {
    icon: Table,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  client_comms: { icon: Mail, color: "text-blue-600", bg: "bg-blue-100" },
  default: { icon: FileText, color: "text-gray-600", bg: "bg-gray-100" },
};

// Confidence badge component
function ConfidenceBadge({ value }: { value?: number }) {
  if (!value) return null;
  const percent = (value * 100).toFixed(1);
  const config =
    value >= 0.8
      ? {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-300",
        }
      : value >= 0.6
      ? {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-300",
        }
      : { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" };

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}
    >
      <Sparkles className="w-3.5 h-3.5" />
      <span className="text-xs font-semibold">{percent}%</span>
    </div>
  );
}

// Execution preview component
function ExecutionPreview({ output }: { output: TaskRow["output"] }) {
  if (!output?.actions || output.actions.length === 0) return null;
  const first = output.actions[0];

  if (first.kind === "draft_message") {
    const data = first.data as { to?: string; body?: string };
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="mt-3 bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
      >
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-4 h-4 text-blue-700" />
          <p className="font-semibold text-blue-900">
            Draft message to {data.to}
          </p>
        </div>
        <p className="text-gray-700 text-sm line-clamp-3">{data.body}</p>
      </motion.div>
    );
  }

  if (first.kind === "extract_table") {
    const data = first.data as { rows?: unknown[]; columns?: string[] };
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="mt-3 bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200"
      >
        <div className="flex items-center gap-2 mb-2">
          <Table className="w-4 h-4 text-purple-700" />
          <p className="font-semibold text-purple-900">
            {data.rows?.length ?? 0} evidence rows extracted
          </p>
        </div>
        <p className="text-gray-700 text-sm">
          Columns: {data.columns?.join(", ")}
        </p>
      </motion.div>
    );
  }

  if (first.kind === "fill_form") {
    const data = first.data as {
      formName?: string;
      fields?: Record<string, unknown>;
    };
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        className="mt-3 bg-linear-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200"
      >
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-green-700" />
          <p className="font-semibold text-green-900">Form: {data.formName}</p>
        </div>
        <p className="text-gray-700 text-sm">
          {Object.keys(data.fields ?? {}).length} fields populated
        </p>
      </motion.div>
    );
  }

  return null;
}

/**
 * The Approvals page lists all tasks with status 'proposed' and allows
 * reviewers to approve or reject them.
 */
export default function ApprovalsPage() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { push } = useToast();

  async function fetchTasks() {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "proposed");
    if (!error) setTasks((data as TaskRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    void fetchTasks();
    const interval = setInterval(() => void fetchTasks(), 15000);
    return () => clearInterval(interval);
  }, []);

  async function handleDecision(taskId: string, approve: boolean) {
    try {
      await fetch("/api/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, approve, reviewer: "demo_user" }),
      });
      push({
        title: approve ? "Task approved" : "Task rejected",
        description: approve
          ? "Execution triggered"
          : "Task marked as rejected",
      });
      await fetchTasks();
    } catch (error) {
      push({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process decision",
      });
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Approvals</h1>
                <p className="text-gray-600">
                  Review and approve agent proposals
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchTasks}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-medium">Refresh</span>
            </motion.button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">Loading proposed tasks…</p>
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-xl border border-gray-200"
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">
                No tasks awaiting approval. Run the orchestrator to generate
                proposals.
              </p>
            </motion.div>
          )}

          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {tasks.map((task, index) => {
                const output = task.output || {};
                const citations = output.citations || [];
                const typeConfig =
                  taskTypeConfig[task.type] || taskTypeConfig.default;
                const Icon = typeConfig.icon;

                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.01 }}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`${typeConfig.bg} p-2.5 rounded-lg`}>
                          <Icon className={`w-5 h-5 ${typeConfig.color}`} />
                        </div>
                        <div>
                          <h2 className="font-semibold text-lg text-gray-900 capitalize">
                            {task.type.replace("_", " ")}
                          </h2>
                          <p className="text-xs text-gray-500">
                            {task.assignee_agent}
                          </p>
                        </div>
                      </div>
                      <ConfidenceBadge value={task.confidence} />
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">
                          Summary:
                        </span>{" "}
                        {output.summary || "n/a"}
                      </p>
                    </div>

                    {citations.length > 0 && (
                      <div className="mb-3 flex flex-wrap gap-2">
                        {citations.map((citation, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            <FileText className="w-3 h-3" />
                            {citation}
                          </span>
                        ))}
                      </div>
                    )}

                    <ExecutionPreview output={output} />

                    <div className="flex gap-3 mt-5">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDecision(task.id, true)}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-green-600 to-green-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Approve
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDecision(task.id, false)}
                        className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold border border-gray-300"
                      >
                        ✕ Reject
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </motion.div>
      </main>
    </>
  );
}
