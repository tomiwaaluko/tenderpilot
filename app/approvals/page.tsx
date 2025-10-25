// Approvals page: Placeholder view explaining that approvals must
// currently be managed directly via the database or API. In a future
// iteration this page could list proposed tasks and allow reviewers to
// approve or reject them.

export default function Approvals() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Approvals</h1>
      <p>
        This demo does not implement a full approvals UI. Proposed tasks
        can be approved or rejected by calling the <code>/api/approve</code>
        endpoint directly. In a complete version you would see a list of
        proposed tasks here with Approve/Reject buttons.
      </p>
    </main>
  );
}
