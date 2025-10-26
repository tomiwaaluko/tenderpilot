"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle,
  Clock,
  FileText,
  GitBranch,
  Rocket,
  Zap,
} from "lucide-react";

interface Stats {
  tasks: Record<string, number>;
  parallel_dispatch: number;
  a2a_handoff: number;
  last_loop: string | null;
}

export default function Telemetry() {
  const [stats, setStats] = useState<Stats | null>(null);

  async function loadStats() {
    const [t, pd, ah, lt] = await Promise.all([
      supabase.from("tasks").select("status"),
      supabase
        .from("audit_logs")
        .select("id")
        .eq("action", "parallel_dispatch"),
      supabase.from("audit_logs").select("id").eq("action", "a2a_handoff"),
      supabase
        .from("audit_logs")
        .select("created_at")
        .eq("action", "loop_tick")
        .order("created_at", { ascending: false })
        .limit(1),
    ]);

    const counts = (t.data ?? []).reduce(
      (acc: Record<string, number>, row: { status: string }) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
      },
      {}
    );

    setStats({
      tasks: counts,
      parallel_dispatch: pd.data?.length ?? 0,
      a2a_handoff: ah.data?.length ?? 0,
      last_loop: lt.data?.[0]?.created_at ?? null,
    });
  }

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!stats)
    return (
      <>
        <Header />
        <div className="p-6 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading telemetry…</p>
        </div>
      </>
    );

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Telemetry</h1>
              <p className="text-gray-600">
                ADK dashboard metrics and insights
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Pending",
                value: stats.tasks.pending ?? 0,
                icon: Clock,
                color: "text-yellow-700",
                bg: "bg-yellow-100",
              },
              {
                label: "Proposed",
                value: stats.tasks.proposed ?? 0,
                icon: FileText,
                color: "text-blue-700",
                bg: "bg-blue-100",
              },
              {
                label: "Approved",
                value: stats.tasks.approved ?? 0,
                icon: CheckCircle,
                color: "text-green-700",
                bg: "bg-green-100",
              },
              {
                label: "Executed",
                value: stats.tasks.executed ?? 0,
                icon: Rocket,
                color: "text-purple-700",
                bg: "bg-purple-100",
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs uppercase font-semibold text-gray-500">
                    {stat.label}
                  </div>
                  <div className={`${stat.bg} p-2 rounded-lg`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <GitBranch className="w-5 h-5 text-blue-700" />
                </div>
                <div className="text-sm uppercase font-semibold text-gray-500">
                  Parallel Dispatches
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {stats.parallel_dispatch}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tasks fanned out concurrently
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-green-700" />
                </div>
                <div className="text-sm uppercase font-semibold text-gray-500">
                  A2A Handoffs
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900">
                {stats.a2a_handoff}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Agent-to-agent knowledge transfers
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-700" />
                </div>
                <div className="text-sm uppercase font-semibold text-gray-500">
                  Last Loop Tick
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {stats.last_loop
                  ? new Date(stats.last_loop).toLocaleString()
                  : "—"}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Continuous watcher status
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
