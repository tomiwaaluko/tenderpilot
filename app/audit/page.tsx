"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import {
  FileText,
  RefreshCw,
  CheckCircle,
  XCircle,
  Settings,
  Brain,
  Zap,
  Clock,
  GitBranch,
  ArrowRightLeft,
  Activity,
} from "lucide-react";

interface AuditRow {
  id: string;
  subject_type: string;
  subject_id: string;
  action: string;
  payload: Record<string, unknown>;
  created_at: string;
}

const actionConfig: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }
> = {
  approved: { icon: CheckCircle, color: "text-green-700", bg: "bg-green-100" },
  rejected: { icon: XCircle, color: "text-red-700", bg: "bg-red-100" },
  executed: { icon: Settings, color: "text-blue-700", bg: "bg-blue-100" },
  created: { icon: Clock, color: "text-gray-700", bg: "bg-gray-100" },
  classified: { icon: Brain, color: "text-purple-700", bg: "bg-purple-100" },
  dispatched: { icon: Zap, color: "text-yellow-700", bg: "bg-yellow-100" },
  parallel_dispatch: {
    icon: GitBranch,
    color: "text-blue-700",
    bg: "bg-blue-100",
  },
  a2a_handoff: {
    icon: ArrowRightLeft,
    color: "text-green-700",
    bg: "bg-green-100",
  },
  loop_tick: { icon: Activity, color: "text-purple-700", bg: "bg-purple-100" },
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLogs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error) setLogs((data as AuditRow[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    void fetchLogs();
    const interval = setInterval(() => void fetchLogs(), 20000);
    return () => clearInterval(interval);
  }, []);

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
              <div className="bg-gray-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
                <p className="text-gray-600">
                  Complete timeline of system actions
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchLogs}
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
                className="w-12 h-12 border-4 border-gray-600 border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600">Loading audit log…</p>
            </div>
          )}

          {!loading && logs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-xl border border-gray-200"
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No audit entries found.</p>
            </motion.div>
          )}

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-4">
              {logs.map((row, index) => {
                const config = actionConfig[row.action] || actionConfig.created;
                const Icon = config.icon;
                const reviewer = row.payload?.reviewer as string | undefined;
                const dispatched = row.payload?.dispatched as
                  | number
                  | undefined;

                return (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative pl-20 group"
                  >
                    <div
                      className={`absolute left-6 w-5 h-5 rounded-full border-4 border-gray-50 ${config.bg} flex items-center justify-center group-hover:scale-125 transition-transform`}
                    >
                      <div className="w-2 h-2 bg-gray-600 rounded-full" />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`${config.bg} p-2 rounded-lg`}>
                            <Icon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900 capitalize">
                                {row.action.replace("_", " ")}
                              </span>
                              <span className="text-sm text-gray-500 capitalize">
                                {row.subject_type}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <code className="bg-gray-100 px-2 py-0.5 rounded font-mono">
                                {row.subject_id.slice(0, 8)}
                              </code>
                              {reviewer && (
                                <span className="text-gray-600">
                                  by {reviewer}
                                </span>
                              )}
                              {dispatched !== undefined && (
                                <span className="text-gray-600">
                                  {dispatched} task{dispatched !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(row.created_at).toLocaleString()}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
