import FailedProductsBlock from "@/components/machine-failure/FailedProductsBlock";

export default function OverviewPage() {
  const lastUpdated = new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="overview-container p-6">
      {/* Header */}
      <header className="overview-header mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Machine Failure Overview
          </h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span aria-hidden>🔄</span>
            Last updated: {lastUpdated}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Generate Report
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Export Data
          </button>
          <button
            type="button"
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Schedule Maintenance
          </button>
        </div>
      </header>

      <FailedProductsBlock />

      {/* KPI Cards - placeholder */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Key Performance Indicators
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="h-10 rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="mt-2 h-6 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Placeholder: Failure KPIs will be wired to data.
        </p>
      </section>

      {/* 7-Day Failure Trends - placeholder */}
      <section className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          7-Day Failure Trends
        </h2>
        <div className="flex h-48 items-center justify-center rounded border border-dashed border-zinc-300 dark:border-zinc-600">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Chart placeholder: Daily Failure Count &amp; Downtime
          </p>
        </div>
      </section>

      {/* Top Failure Causes - placeholder */}
      <section className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Top Failure Causes (Pareto Analysis)
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Placeholder: Ranked list of failure causes with occurrences, percentage, and avg downtime will be implemented here.
        </p>
      </section>
    </div>
  );
}
