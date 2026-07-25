import React, { useState,useEffect } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { ConfigEditor } from "./components/ConfigEditor";
import { ReportViewer } from "./components/ReportViewer";
import { CodeBrowser } from "./components/CodeBrowser";
import { CliSimulator } from "./components/CliSimulator";
import { TestMetrics, RawResultLog, RepositoryFile } from "./types";


export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "config" | "report" | "code" | "cli"
  >("dashboard");

  const [configYaml, setConfigYaml] = useState("");
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [logs, setLogs] = useState<RawResultLog[]>([]);
  const [markdownReport, setMarkdownReport] = useState("");
  const [files, setFiles] = useState<RepositoryFile[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTest = async () => {
    setIsRunning(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/run-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config_path: "config/test_plan.json",
          output_path: "reports/report.md",
          config_yaml: configYaml,
        }),
      });

      const data = await res.json();

if (res.ok && data.success) {
  setMetrics(data.metrics);
  setLogs([]);

  // Load the generated Markdown report
  const reportRes = await fetch(
    "http://127.0.0.1:8000/api/report"
  );

  const reportData = await reportRes.json();

  if (reportRes.ok && reportData.success) {
    setMarkdownReport(reportData.report);
  }
}
      else {
        alert(data.detail || "Execution failed");
      }
    } catch (err: any) {
      alert(`Network / Engine error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
  const loadConfig = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/config");
      const data = await res.json();

      if (data.success) {
        setConfigYaml(data.configYaml);
      }
    } catch (err) {
      console.error("Failed to load configuration:", err);
    }
  };

  loadConfig();
}, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        files={files}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <Dashboard
            metrics={metrics}
            logs={logs}
            isRunning={isRunning}
            onRunTest={handleRunTest}
            configYaml={configYaml}
          />
        )}

        {activeTab === "config" && (
          <ConfigEditor
            configYaml={configYaml}
            setConfigYaml={setConfigYaml}
            onRunTest={handleRunTest}
            isRunning={isRunning}
          />
        )}

        {activeTab === "report" && (
          <ReportViewer markdownReport={markdownReport} />
        )}

        {activeTab === "code" && <CodeBrowser files={files} />}

        {activeTab === "cli" && (
          <CliSimulator
            onRunTest={handleRunTest}
            isRunning={isRunning}
          />
        )}
      </main>

      <footer className="h-12 border-t border-slate-800 bg-slate-900 px-6 flex items-center justify-between text-[11px] font-medium">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-wider">
              STATUS:
            </span>
            <span className="text-emerald-400 font-bold font-mono uppercase">
              {isRunning ? "EXEC_ACTIVE" : "IDLE"}
            </span>
          </div>

          <div className="flex items-center gap-2 hidden sm:flex">
            <span className="text-slate-500 uppercase tracking-wider">
              MEMORY:
            </span>
            <span className="text-slate-300 font-mono">42.1 MB</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-wider">
              ENGINE:
            </span>
            <span className="text-slate-300 font-mono">
              Python 3.11.4 Asyncio
            </span>
          </div>
        </div>

        <div className="text-slate-500 font-mono hidden md:block">
          aiohttp + PyYAML + Pytest + FastAPI
        </div>
      </footer>
    </div>
  );
}