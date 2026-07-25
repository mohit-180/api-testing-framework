import React from "react";
import {
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Gauge,
  BarChart3,
  Server,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { TestMetrics, RawResultLog } from "../types";

interface DashboardProps {
  metrics: TestMetrics | null;
  logs: RawResultLog[];
  isRunning: boolean;
  onRunTest: () => void;
  configYaml: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  logs,
  isRunning,
  onRunTest,
  configYaml,
}) => {
  // Chart data for percentiles
  const percentileData = metrics
    ? [
        { name: "Min", latency: metrics.min_latency_ms, fill: "#3b82f6" },
        { name: "Avg", latency: metrics.avg_latency_ms, fill: "#6366f1" },
        { name: "p50", latency: metrics.p50_latency_ms, fill: "#10b981" },
        { name: "p90", latency: metrics.p90_latency_ms, fill: "#f59e0b" },
        { name: "p95", latency: metrics.p95_latency_ms, fill: "#ef4444" },
        { name: "p99", latency: metrics.p99_latency_ms, fill: "#8b5cf6" },
        { name: "Max", latency: metrics.max_latency_ms, fill: "#ec4899" },
      ]
    : [];

  const statusData = metrics
    ? Object.entries(metrics.status_code_distribution).map(([code, count]) => ({
        code: `HTTP ${code}`,
        count,
        fill: code.startsWith("2")
          ? "#10b981"
          : code.startsWith("4")
          ? "#f59e0b"
          : code.startsWith("5")
          ? "#ef4444"
          : "#6b7280",
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner Control */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Live Load Generator
              </span>
              <span className="text-xs font-mono text-slate-500">Python 3.11.4 aiohttp</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5 tracking-tight">
              Asynchronous REST API Benchmark
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Simulate high-concurrency HTTP workloads with persistent session connection pooling and measure real-time latency distributions.
            </p>
          </div>

          <button
            onClick={onRunTest}
            disabled={isRunning}
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
              isRunning
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>BENCHMARK RUNNING...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>NEW TEST RUN</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid - Matching Professional Polish Flagship Pattern */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-800 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-slate-950 p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Requests</span>
            <div>
              <div className="text-3xl font-mono font-bold text-white mt-2">
                {metrics.total_requests.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Duration: {metrics.total_duration_sec}s
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Success Rate</span>
            <div>
              <div className="text-3xl font-mono font-bold text-emerald-400 mt-2">
                {metrics.success_rate_pct}%
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                {metrics.successful_requests} ok / {metrics.failed_requests} err
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Latency</span>
            <div>
              <div className="text-3xl font-mono font-bold text-blue-400 mt-2">
                {metrics.avg_latency_ms} <span className="text-xs text-slate-500 font-sans font-normal">ms</span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                p90: {metrics.p90_latency_ms} ms
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-6 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Throughput (RPS)</span>
            <div>
              <div className="text-3xl font-mono font-bold text-orange-400 mt-2">
                {metrics.rps}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                p99: {metrics.p99_latency_ms} ms
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts & Percentiles Row */}
      {metrics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Latency Percentile Summary Table */}
          <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Latency Percentiles
              </h3>
              <span className="text-[10px] text-slate-500 font-mono uppercase px-2 py-0.5 border border-slate-700 rounded">
                ms
              </span>
            </div>

            <div className="flex-1 p-5">
              <table className="w-full text-sm font-mono">
                <tbody>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2.5 text-slate-500">Min Latency</td>
                    <td className="py-2.5 text-right text-slate-200">{metrics.min_latency_ms}</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2.5 text-slate-500">p50 (Median)</td>
                    <td className="py-2.5 text-right text-emerald-400 font-bold">{metrics.p50_latency_ms}</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2.5 text-slate-500">Avg Latency</td>
                    <td className="py-2.5 text-right text-slate-200">{metrics.avg_latency_ms}</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2.5 text-slate-500">p90</td>
                    <td className="py-2.5 text-right text-blue-400">{metrics.p90_latency_ms}</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2.5 text-slate-500">p95</td>
                    <td className="py-2.5 text-right text-slate-200">{metrics.p95_latency_ms}</td>
                  </tr>
                  <tr className="border-b border-slate-800/50">
                    <td className="py-2.5 text-slate-500">p99</td>
                    <td className="py-2.5 text-right text-orange-400 font-bold">{metrics.p99_latency_ms}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 text-slate-500">Max Latency</td>
                    <td className="py-2.5 text-right text-rose-400 font-bold">{metrics.max_latency_ms}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Latency Breakdown (ms)</span>
                </h3>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">aiohttp high-precision timers</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={percentileData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#020617", borderColor: "#334155", color: "#f8fafc", fontFamily: "monospace", fontSize: "12px" }}
                    formatter={(val: any) => [`${val} ms`, "Latency"]}
                  />
                  <Bar dataKey="latency" radius={[4, 4, 0, 0]}>
                    {percentileData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Raw Execution Logs Table */}
      {logs.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">Live Request Log Stream</h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">First {logs.length} worker logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 bg-slate-950/60 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Endpoint Path</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Latency</th>
                  <th className="py-3 px-4">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.method === "GET"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : log.method === "POST"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : log.method === "PUT"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {log.method}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">{log.endpoint_path}</td>
                    <td className="py-2.5 px-4">
                      {log.status_code ? (
                        <span
                          className={`font-bold ${
                            log.status_code < 300
                              ? "text-emerald-400"
                              : log.status_code < 500
                              ? "text-amber-400"
                              : "text-rose-400"
                          }`}
                        >
                          {log.status_code}
                        </span>
                      ) : (
                        <span className="text-rose-400">TIMEOUT</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">{log.latency_ms.toFixed(1)} ms</td>
                    <td className="py-2.5 px-4">
                      {log.is_success ? (
                        <span className="text-emerald-400 inline-flex items-center space-x-1 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>200 OK</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 inline-flex items-center space-x-1 font-semibold">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{log.error || "Failed"}</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
