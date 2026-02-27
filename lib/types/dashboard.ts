export interface KPIData {
  machinesOnline: {
    online: number;
    total: number;
    percentage: number;
  };
  activeAlerts: {
    critical: number;
    warning: number;
    total: number;
  };
  failureRate: {
    current: number;
    trend: "up" | "down" | "stable";
    previousPeriod: number;
  };
  oee: {
    overall: number;
    availability: number;
    performance: number;
    quality: number;
  };
}
