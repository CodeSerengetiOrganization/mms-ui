"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutList, AlertTriangle, TrendingUp, Bot } from "lucide-react";

const TABS = [
  { id: "failure-overview", label: "Overview", Icon: LayoutList, route: "/machine-failure/overview" },
  { id: "failure-alerts", label: "Alerts", Icon: AlertTriangle, route: "/machine-failure/alerts" },
  { id: "failure-analysis", label: "Analysis", Icon: TrendingUp, route: "/machine-failure/analysis" },
  { id: "failure-ai", label: "AI Insights", Icon: Bot, route: "/machine-failure/ai" },
];

export default function MachineFailureTabs() {
  const pathname = usePathname();

  return (
    <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="px-6 pt-4">
        <div className="mb-2">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Machine Failure Management
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
            Comprehensive monitoring, analysis, and AI-powered insights for industrial equipment failures
          </p>
        </div>
        <nav className="-mb-px flex gap-1" aria-label="Machine failure sections">
          {TABS.map((tab) => {
            const isActive =
              pathname === tab.route || pathname.startsWith(tab.route + "/");
            return (
              <Link
                key={tab.id}
                href={tab.route}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                    : "border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
                }`}
              >
                <tab.Icon className="h-4 w-4 shrink-0" aria-hidden />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
