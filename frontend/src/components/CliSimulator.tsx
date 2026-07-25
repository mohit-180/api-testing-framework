import React, { useState } from "react";
import { Terminal, Play, CornerDownLeft, RefreshCw, CheckCircle2 } from "lucide-react";

interface CliSimulatorProps {
  onRunTest: () => void;
  isRunning: boolean;
}

export const CliSimulator: React.FC<CliSimulatorProps> = ({ onRunTest, isRunning }) => {
  const [commandInput, setCommandInput] = useState("python main.py");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Python 3.11.4 (main, Jun 20 2023, 14:12:00) [GCC 11.3.0] on linux",
    "Type 'help', 'copyright', 'credits' or 'license' for more information.",
    "$ python main.py --help",
    "usage: main.py [-h] [--config CONFIG] [--output OUTPUT]",
    "",
    "Production-Grade Asynchronous REST API Testing & Load Generation Framework",
    "",
    "options:",
    "  -h, --help            show this help message and exit",
    "  --config CONFIG, -c CONFIG",
    "                        Path to JSON or YAML test plan file (default: config/test_plan.yaml)",
    "  --output OUTPUT, -o OUTPUT",
    "                        Path where markdown report will be written (default: reports/report.md)",
    "",
    "Ready. Try running: 'python main.py' or 'pytest'",
  ]);

  const handleExecuteCommand = (cmdStr?: string) => {
    const cmd = (cmdStr || commandInput).trim();
    if (!cmd) return;

    const newLogs = [...terminalLogs, `$ ${cmd}`];

    if (cmd.startsWith("python main.py")) {
      newLogs.push("[INFO] Loading test plan from: 'config/test_plan.yaml'");
      newLogs.push("[INFO] Initializing engine with 15 concurrent workers for 150 total requests...");
      newLogs.push("");
      newLogs.push("============================================================");
      newLogs.push("          API BENCHMARK & LOAD GENERATION REPORT          ");
      newLogs.push("============================================================");
      newLogs.push(" Target Base URL    : http://localhost:3000/api/mock");
      newLogs.push(" Total Duration     : 1.248 seconds");
      newLogs.push(" Concurrency Level  : 15 concurrent users");
      newLogs.push(" Total Requests     : 150");
      newLogs.push(" Successful (2xx/3xx): 148 (98.7%)");
      newLogs.push(" Failed / Errors    : 2 (1.3%)");
      newLogs.push(" Timeouts           : 0");
      newLogs.push(" Throughput (RPS)   : 120.19 req/sec");
      newLogs.push("------------------------------------------------------------");
      newLogs.push(" LATENCY DISTRIBUTION:");
      newLogs.push("   Min Latency       : 18.20 ms");
      newLogs.push("   Avg Latency       : 42.50 ms");
      newLogs.push("   Max Latency       : 185.10 ms");
      newLogs.push("   p50 Percentile    : 38.00 ms");
      newLogs.push("   p90 Percentile    : 62.40 ms");
      newLogs.push("   p95 Percentile    : 85.10 ms");
      newLogs.push("   p99 Percentile    : 142.30 ms");
      newLogs.push("------------------------------------------------------------");
      newLogs.push(" HTTP STATUS CODE BREAKDOWN:");
      newLogs.push("   HTTP 200        :   145 requests ( 96.7%)");
      newLogs.push("   HTTP 429        :     3 requests (  2.0%)");
      newLogs.push("   HTTP 500        :     2 requests (  1.3%)");
      newLogs.push("============================================================");
      newLogs.push("");
      newLogs.push("[INFO] Full markdown report written successfully to: 'reports/report.md'");
      onRunTest();
    } else if (cmd === "pytest") {
      newLogs.push("============================== test session starts ==============================");
      newLogs.push("platform linux -- Python 3.11.4, pytest-8.1.1, pluggy-1.4.0");
      newLogs.push("rootdir: /api-testing-framework");
      newLogs.push("collected 10 items");
      newLogs.push("");
      newLogs.push("tests/test_config.py .....                                               [ 50%]");
      newLogs.push("tests/test_metrics.py ...                                                [ 80%]");
      newLogs.push("tests/test_utils.py ..                                                   [100%]");
      newLogs.push("");
      newLogs.push("============================== 10 passed in 0.24s ==============================");
    } else if (cmd === "clear") {
      setTerminalLogs([]);
      return;
    } else {
      newLogs.push(`bash: command not found: ${cmd}. Try 'python main.py' or 'pytest' or 'clear'`);
    }

    setTerminalLogs(newLogs);
    setCommandInput("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <span>Interactive CLI Terminal Simulation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test CLI invocation commands directly: <code className="text-emerald-400 font-mono">python main.py</code>,{" "}
            <code className="text-emerald-400 font-mono">pytest</code>, <code className="text-emerald-400 font-mono">clear</code>.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleExecuteCommand("python main.py")}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center space-x-1.5 shadow"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run 'python main.py'</span>
          </button>
          <button
            onClick={() => handleExecuteCommand("pytest")}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Run 'pytest'</span>
          </button>
        </div>
      </div>

      {/* Terminal View - Black Terminal Card */}
      <div className="bg-black border border-slate-800 rounded-xl overflow-hidden shadow-2xl font-mono text-[11px] text-slate-200 min-h-[480px] flex flex-col">
        {/* Terminal Header */}
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            </div>
            <span className="text-[10px] text-slate-500 font-mono ml-2">main.py --config config/test_plan.yaml</span>
          </div>
          <span className="text-[10px] text-slate-600 uppercase tracking-widest font-mono">Bash 5.2</span>
        </div>

        <div className="flex-1 p-5 overflow-y-auto space-y-1 leading-relaxed">
          {terminalLogs.map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.startsWith("$")
                  ? "text-emerald-400 font-semibold pt-1"
                  : log.includes("REPORT") || log.includes("==========")
                  ? "text-amber-300"
                  : log.includes("passed")
                  ? "text-emerald-400 font-bold"
                  : "text-slate-300"
              }`}
            >
              {log}
            </div>
          ))}
        </div>

        {/* Input prompt line */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteCommand();
          }}
          className="flex items-center space-x-2 px-4 py-3 bg-slate-950 border-t border-slate-800/80"
        >
          <span className="text-emerald-400 font-bold">$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            className="flex-1 bg-transparent text-slate-100 font-mono text-xs focus:outline-none placeholder:text-slate-600"
            placeholder="Type 'python main.py' or 'pytest'..."
          />
          <button
            type="submit"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
          >
            <CornerDownLeft className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </form>
      </div>
    </div>
  );
};
