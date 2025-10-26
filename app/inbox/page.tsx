"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useToast } from "@/components/Toast";
import { motion } from "framer-motion";
import { Inbox as InboxIcon, Send } from "lucide-react";

// Inbox page: provides a form to ingest a message for a case and
// immediately triggers classification after ingestion.

export default function Inbox() {
  const [caseId, setCaseId] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  // Load last used caseId from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tp.caseId");
    if (saved) setCaseId(saved);
  }, []);

  // Save caseId to localStorage when it changes
  useEffect(() => {
    if (caseId) localStorage.setItem("tp.caseId", caseId);
  }, [caseId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Call ingest API
      const fd = new FormData();
      fd.append("caseId", caseId);
      fd.append("text", text);
      const ingestRes = await fetch("/api/ingest", {
        method: "POST",
        body: fd,
      });
      const ingestData = await ingestRes.json();

      if (!ingestData.messageId) {
        push({ title: "Ingest failed", description: "Could not save message" });
        return;
      }

      // Call classify API
      await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, messageId: ingestData.messageId }),
      });

      push({
        title: "Message ingested",
        description: "Saved & classified successfully",
      });
      setText("");
    } catch (error) {
      push({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process message",
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
            <div className="bg-blue-100 p-3 rounded-lg">
              <InboxIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inbox</h1>
              <p className="text-gray-600">
                Submit and classify client messages
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Case ID
                </label>
                <input
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., CASE-001"
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1.5">
                  📋 Paste your case UUID from Supabase or use any identifier
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Paste the client's email or message here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  required
                  disabled={loading}
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all ${
                  loading
                    ? "opacity-50 cursor-not-allowed bg-gray-400 text-white"
                    : "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
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
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit & Classify
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
