"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scale,
  Inbox,
  Rocket,
  CheckCircle,
  FileText,
  Activity,
} from "lucide-react";

const navItems = [
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/tasks", label: "Tasks", icon: Rocket },
  { href: "/approvals", label: "Approvals", icon: CheckCircle },
  { href: "/audit", label: "Audit", icon: FileText },
  { href: "/telemetry", label: "Telemetry", icon: Activity },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-linear-to-br from-blue-600 to-purple-600 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">
                TenderPilot
              </h1>
              <p className="text-xs text-gray-500">AI Legal Ops</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
