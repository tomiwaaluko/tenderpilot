import Link from 'next/link';

/**
 * A simple navigation bar used across the demo pages. It provides quick
 * access to the core flows: Inbox, Tasks, Approvals, Audit and the
 * mock portal. To avoid repeating markup on every page, this
 * component can be imported and rendered at the top of each page.
 */
export default function Nav() {
  return (
    <nav className="flex flex-wrap gap-4 mb-4">
      <Link href="/inbox" className="underline text-blue-600">Inbox</Link>
      <Link href="/tasks" className="underline text-blue-600">Tasks</Link>
      <Link href="/approvals" className="underline text-blue-600">Approvals</Link>
      <Link href="/audit" className="underline text-blue-600">Audit</Link>
      <Link href="/mock-portal" className="underline text-blue-600">Mock Portal</Link>
    </nav>
  );
}
