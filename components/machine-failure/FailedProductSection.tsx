"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchFailedProducts, processChartData } from "@/lib/failed-products";
import type { FailedProductDto } from "@/lib/types";
import type { AppError } from "@/lib/errors";
import FailedProductBarChart from "./FailedProductBarChart";
import { BarChart3, DollarSign, Clock, AlertTriangle, Search, Server, Wifi, Info, AlertCircle } from "lucide-react";

function getTotalFailedCount(item: FailedProductDto): number {
  return item.failedProductCount?.reduce((a, b) => a + b, 0) ?? 0;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function getErrorIcon(type: AppError["type"] | null) {
  switch (type) {
    case "VALIDATION_ERROR": return AlertTriangle;
    case "NOT_FOUND": return Search;
    case "SERVER_ERROR": return Server;
    case "NETWORK_ERROR": return Wifi;
    case "UNKNOWN_ERROR": return AlertCircle;
    default: return Info;
  }
}

function getErrorContainerClass(type: AppError["type"] | null): string {
  if (!type) return "border-cyan-500 bg-cyan-50 dark:border-cyan-700 dark:bg-cyan-950/30";
  switch (type) {
    case "VALIDATION_ERROR": return "border-amber-500 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30";
    case "NOT_FOUND": return "border-zinc-500 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50";
    case "SERVER_ERROR": return "border-red-500 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20";
    case "NETWORK_ERROR": return "border-orange-500 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/30";
    case "UNKNOWN_ERROR": return "border-violet-500 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/30";
    default: return "border-zinc-300 bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900/50";
  }
}

export default function FailedProductSection() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [data, setData] = useState<FailedProductDto[] | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setShowMessage(false);
    const result = await fetchFailedProducts(4);
    setLoading(false);
    if (result.ok) {
      setData(result.data);
      if (result.data.length === 0) {
        setMessageText("No failed products found - great job!");
        setShowMessage(true);
      }
    } else {
      setError(result.error);
      setData(null);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const showRetry = error && ["SERVER_ERROR", "NETWORK_ERROR", "UNKNOWN_ERROR"].includes(error.type);
  const filteredProducts = data?.filter((item) => {
    if (selectedSeverity !== "all" && item.severity !== selectedSeverity) return false;
    if (selectedStatus !== "all" && item.status !== selectedStatus) return false;
    return true;
  }) ?? [];
  const chartData = data ? processChartData(data) : [];
  const totalReplacementCost = 0;
  const totalDowntime = 0;

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl bg-gradient-to-br from-slate-50/90 to-slate-200/90 p-6 dark:from-slate-900/80 dark:to-slate-900/80">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500 dark:border-slate-700 dark:border-t-blue-400" />
        <p className="text-slate-600 dark:text-slate-400">Loading failed products data...</p>
      </div>
    );
  }

  if (error || showMessage) {
    const Icon = getErrorIcon(error?.type ?? null);
    return (
      <div className={"rounded-xl border-l-4 p-6 shadow-sm " + getErrorContainerClass(error?.type ?? null)}>
        <div className="flex flex-col items-center text-center">
          <Icon className="mb-4 h-12 w-12 text-slate-600 dark:text-slate-400" aria-hidden />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{error ? "Error" : "Information"}</h3>
          <p className="mt-2 text-slate-700 dark:text-slate-300">{error ? error.message : messageText}</p>
          {showRetry && (
            <button type="button" onClick={load} className="mt-4 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <div className="rounded-xl bg-gradient-to-br from-slate-50/90 via-slate-100/95 to-slate-200/90 p-6 dark:from-slate-900/80 dark:via-slate-800/90 dark:to-slate-900/80">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Failed Products Management</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">View Failed Products Count by Machine Unit</p>
      </header>

      <div className="mb-8 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Failed Product Analysis</h3>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Visual analysis of failed products per batch across different channels</p>
        <div className="mt-6 flex flex-col gap-8">
          {data.map((item, i) => (
            <div key={String(i)} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h4 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Machine {item.machineId} - Rack {item.rackId} - Channel {item.channelNumber}</h4>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Batch Size: {item.batchSize ?? "—"} | Total Batches: {item.failedProductCount?.length ?? 0}</p>
              <div className="mt-4">
                <FailedProductBarChart data={chartData[i] ?? []} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden />
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{filteredProducts.length}</div>
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Parts</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <DollarSign className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden />
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(totalReplacementCost)}</div>
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Replacement Cost</div>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" aria-hidden />
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{formatDuration(totalDowntime)}</div>
            <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Downtime</div>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-end gap-6 rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-2">
          <label htmlFor="severity-filter" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filter by Severity:</label>
          <select id="severity-filter" value={selectedSeverity} onChange={(e) => setSelectedSeverity(e.target.value)} className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="status-filter" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Filter by Status:</label>
          <select id="status-filter" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="replaced">Replaced</option>
            <option value="discarded">Discarded</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Part Info</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Machine</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Failure Details</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Impact</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item, index) => (
                <tr key={String(index)} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">Channel {item.channelNumber ?? "—"}</div>
                    <div className="text-slate-500 dark:text-slate-400">Batch Data</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold text-slate-800 dark:text-slate-100">{item.machineId ?? "—"}</div>
                    <div className="text-slate-500 dark:text-slate-400">Rack {item.rackId ?? "—"}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-100">Batch Size: {item.batchSize ?? "—"}</span>
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase text-slate-600 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-300">Active</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.failedProductCount?.length ?? 0} batches</div>
                    <div className="text-slate-700 dark:text-slate-300">Total failed: {getTotalFailedCount(item)}</div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex justify-between gap-2"><span className="text-xs uppercase text-slate-500 dark:text-slate-400">Channel:</span><span className="font-semibold text-slate-800 dark:text-slate-100">{item.channelNumber ?? "—"}</span></div>
                    <div className="flex justify-between gap-2"><span className="text-xs uppercase text-slate-500 dark:text-slate-400">Batch Size:</span><span className="font-semibold text-slate-800 dark:text-slate-100">{item.batchSize ?? "—"}</span></div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Monitoring</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
