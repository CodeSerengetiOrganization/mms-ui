/**
 * API types for failed products and machine status.
 * Align with Angular/OpenAPI shapes (e.g. MachineStatusResponse, FailedProductDto).
 */

export interface FailedProductDto {
  machineId?: number;
  rackId?: number;
  channelNumber?: number;
  batchSize?: number;
  /** Per-batch failure counts (used for charts and totals). */
  failedProductCount: number[];
  severity?: "critical" | "high" | "medium" | "low";
  status?: "pending" | "in-progress" | "replaced" | "discarded";
}

export interface MachineStatusResponse {
  failedProducts?: FailedProductDto[];
}

/** Chart data point (e.g. for Recharts). */
export interface ChartDataPoint {
  name: string;
  value: number;
}
