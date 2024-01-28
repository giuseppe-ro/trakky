export const serverUrl =  "http://trakky-api.localdomain/api";

export const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export enum Endpoint {
  Payments = "payments",
  Budgets = "budgets",
  Types = "types",
  Owners = "owners",
  Backup = "backup",
  HealthCheck = "health-check"
}