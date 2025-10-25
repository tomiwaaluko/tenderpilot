// A simple mock provider portal used to demonstrate the Gemini Computer
// Use model. In a real implementation, the Computer Use agent would
// navigate to this page, fill in the form, and submit it. For now we
// simply render a static form without submission logic.

export default function MockPortal() {
  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">
        Orlando Care Provider — Records Request
      </h1>
      <form className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Patient Full Name"
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="DOB (YYYY-MM-DD)"
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Claim Number"
        />
        <textarea
          className="w-full border p-2 rounded"
          placeholder="Notes"
        />
        <button
          type="button"
          className="border rounded px-4 py-2 bg-foreground text-background"
        >
          Submit Request
        </button>
      </form>
      <p className="text-sm text-gray-500">For demo use only.</p>
    </main>
  );
}
