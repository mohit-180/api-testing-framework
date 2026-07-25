export interface EndpointConfig {
  name?: string;
  path: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface TestPlanConfig {
  name: string;
  base_url: string;
  timeout: number;
  concurrent_users: number;
  number_of_requests: number;
  headers?: Record<string, string>;
  endpoints: EndpointConfig[];
}

export interface TestMetrics {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  timeout_requests: number;
  success_rate_pct: number;
  error_rate_pct: number;
  rps: number;
  avg_latency_ms: number;
  min_latency_ms: number;
  max_latency_ms: number;
  p50_latency_ms: number;
  p90_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
  status_code_distribution: Record<string, number>;
  total_duration_sec: number;
}

export interface RawResultLog {
  endpoint_path: string;
  method: string;
  status_code: number | null;
  latency_ms: number;
  is_success: boolean;
  is_timeout: boolean;
  error: string | null;
}

export interface RepositoryFile {
  path: string;
  label: string;
  content: string;
}
