export default function AnalysisPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Machine Failure – Analysis
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Failure analysis and insights: performance over time, failure patterns, maintenance recommendations, and analysis summary. Coming soon.
      </p>
      <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/50 p-8 text-center dark:border-zinc-600 dark:bg-zinc-900/30">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Analysis view will show: time-based metrics (MTBF, MTTR, availability), failure patterns with risk level, maintenance recommendations with ROI, and summary statistics.
        </p>
      </div>
    </div>
  );
}
