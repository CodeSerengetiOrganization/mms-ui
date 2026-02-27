import Link from "next/link";
import type { KPIData } from "@/lib/types";

// Mock data (replace with server fetch later)
const MOCK_KPI: KPIData = {
  machinesOnline: {
    online: 47,
    total: 52,
    percentage: 90.4,
  },
  activeAlerts: {
    critical: 3,
    warning: 8,
    total: 11,
  },
  failureRate: {
    current: 2.3,
    trend: "down",
    previousPeriod: 2.8,
  },
  oee: {
    overall: 82.5,
    availability: 91.2,
    performance: 94.1,
    quality: 96.2,
  },
};

function getStatusClass(percentage: number): string {
  if (percentage >= 90) return "text-emerald-600 dark:text-emerald-400";
  if (percentage >= 75) return "text-green-600 dark:text-green-400";
  if (percentage >= 60) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function getTrendIcon(trend: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up":
      return "📈";
    case "down":
      return "📉";
    default:
      return "➡️";
  }
}

function getTrendClass(trend: "up" | "down" | "stable"): string {
  switch (trend) {
    case "up":
      return "text-red-600 dark:text-red-400";
    case "down":
      return "text-emerald-600 dark:text-emerald-400";
    default:
      return "text-zinc-500 dark:text-zinc-400";
  }
}

export default function DashboardPage() {
  const kpi = MOCK_KPI;

  return (
    <div className="dashboard p-6">
      <header className="dashboard-header mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Machine Monitoring Dashboard
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Real-time overview of your manufacturing operations
        </p>
      </header>

      {/* KPI Grid */}
      <section className="kpi-grid mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Machines Online */}
        <div className="kpi-card rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="kpi-header mb-3 flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🏭
            </span>
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Machines Online
            </h3>
          </div>
          <div className="kpi-content">
            <div className="kpi-main-value flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {kpi.machinesOnline.online}
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                / {kpi.machinesOnline.total}
              </span>
            </div>
            <div className={`kpi-percentage text-lg font-medium ${getStatusClass(kpi.machinesOnline.percentage)}`}>
              {kpi.machinesOnline.percentage}%
            </div>
            <div className="kpi-label mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Operational Status
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="kpi-card rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="kpi-header mb-3 flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🚨
            </span>
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Active Alerts
            </h3>
          </div>
          <div className="kpi-content">
            <div className="kpi-main-value text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              {kpi.activeAlerts.total}
            </div>
            <div className="alert-breakdown mt-1 flex gap-3 text-sm">
              <span className="font-medium text-red-600 dark:text-red-400">
                {kpi.activeAlerts.critical} Critical
              </span>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {kpi.activeAlerts.warning} Warning
              </span>
            </div>
            <div className="kpi-label mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Requiring Attention
            </div>
          </div>
        </div>

        {/* Failure Rate */}
        <div className="kpi-card rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="kpi-header mb-3 flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              ⚠️
            </span>
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Failure Rate
            </h3>
          </div>
          <div className="kpi-content">
            <div className="kpi-main-value flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                {kpi.failureRate.current}%
              </span>
              <span className={`text-lg ${getTrendClass(kpi.failureRate.trend)}`} aria-hidden>
                {getTrendIcon(kpi.failureRate.trend)}
              </span>
            </div>
            <div className="kpi-comparison text-sm text-zinc-500 dark:text-zinc-400">
              vs {kpi.failureRate.previousPeriod}% last period
            </div>
            <div className="kpi-label mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Overall Equipment
            </div>
          </div>
        </div>

        {/* OEE */}
        <div className="kpi-card kpi-card-wide rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:col-span-2 lg:col-span-1">
          <div className="kpi-header mb-3 flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              📊
            </span>
            <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Overall Equipment Effectiveness (OEE)
            </h3>
          </div>
          <div className="kpi-content">
            <div className="oee-main mb-3">
              <div className={`oee-overall text-2xl font-semibold ${getStatusClass(kpi.oee.overall)}`}>
                {kpi.oee.overall}%
              </div>
            </div>
            <div className="oee-breakdown space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Availability</span>
                <span className={`font-medium ${getStatusClass(kpi.oee.availability)}`}>
                  {kpi.oee.availability}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Performance</span>
                <span className={`font-medium ${getStatusClass(kpi.oee.performance)}`}>
                  {kpi.oee.performance}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Quality</span>
                <span className={`font-medium ${getStatusClass(kpi.oee.quality)}`}>
                  {kpi.oee.quality}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Quick Actions
        </h2>
        <div className="action-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/machine-failure/alerts"
            className="action-button flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <span className="text-2xl" aria-hidden>
              🚨
            </span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              View All Alerts
            </span>
          </Link>
          <Link
            href="/machine-failure/analysis"
            className="action-button flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <span className="text-2xl" aria-hidden>
              📈
            </span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Failure Analysis
            </span>
          </Link>
          <Link
            href="/reports"
            className="action-button flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <span className="text-2xl" aria-hidden>
              📄
            </span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              Generate Report
            </span>
          </Link>
          <Link
            href="/settings"
            className="action-button flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-left shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >
            <span className="text-2xl" aria-hidden>
              ⚙️
            </span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">
              System Settings
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
