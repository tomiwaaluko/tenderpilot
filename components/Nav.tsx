"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * A navigation bar with active route highlighting. It provides quick
 * access to the core flows: Inbox, Tasks, Approvals, Audit and the
 * mock portal.
 */
export default function Nav() {
  const path = usePathname();
  const item = (href: string, label: string) => {
    const active = path === href;
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-xl transition-colors ${
          active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="flex items-center gap-2 p-4 border-b mb-6">
      {item("/inbox", "Inbox")}
      {item("/tasks", "Tasks")}
      {item("/approvals", "Approvals")}
      {item("/audit", "Audit")}
      {item("/mock-portal", "Mock Portal")}
    </nav>
  );
}
