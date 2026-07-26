import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { ConfigEditor } from "./components/ConfigEditor";
import { ReportViewer } from "./components/ReportViewer";
import { CodeBrowser } from "./components/CodeBrowser";
import { CliSimulator } from "./components/CliSimulator";
import { TestMetrics, RawResultLog, RepositoryFile } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "config" | "report" | "code" | "cli"
  >("dashboard");

  const [configYaml, setConfigYaml] = useState("");
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [logs, setLogs] = useState<RawResultLog[]>([]);
  const [markdownReport, setMarkdownReport] = useState("");
  const [repositoryFiles, setRepositoryFiles] = useState<RepositoryFile[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTest = async (): Promise<string[]> => {
    setIsRunning(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/run-test`, {
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

        const reportRes = await fetch(`${API_BASE_URL}/api/report`);

        const reportData = await reportRes.json();

        if (reportRes.ok && reportData.success) {
          setMarkdownReport(reportData.report);
        }

        return data.terminal_output ?? [];
      } else {
        alert(data.detail || "Execution failed");
        return [];
      }
    } catch (err: any) {
      alert(`Network / Engine error: ${err.message}`);
      return [];
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/config`);
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

  useEffect(() => {
    const loadRepositoryFiles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/files`);
        const data = await response.json();

        if (data.success) {
          setRepositoryFiles(data.files);
        }
      } catch (error) {
        console.error("Failed to load repository files:", error);
      }
    };

    loadRepositoryFiles();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        files={repositoryFiles}
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

        {activeTab === "code" && <CodeBrowser files={repositoryFiles} />}

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
