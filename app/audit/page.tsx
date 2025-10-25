// Audit page: Placeholder view explaining the audit log concept. A
// complete implementation would query the audit_logs table and render
// entries chronologically.

export default function Audit() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Audit Log</h1>
      <p>
        In this simplified demo, audit log entries are recorded in the
        database whenever a task is dispatched, approved, rejected, or
        otherwise acted upon. You can query the <code>audit_logs</code>
        table to see a history of these events. Building a UI to view
        audit entries is left as an exercise for the reader.
      </p>
    </main>
  );
}
