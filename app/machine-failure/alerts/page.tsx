export default function AlertsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Machine Failure – Alerts
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Critical Alerts, alert list by severity, and alert statistics (last 24h). Coming soon.
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center dark:border-zinc-600 dark:bg-zinc-900/30">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Alerts view will show: Critical / High / Medium / Low counts, alert cards with acknowledge and export actions, and alert statistics.
        </p>
      </div>
    </div>
  );
}
