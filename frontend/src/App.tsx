import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { ConfigEditor } from "./components/ConfigEditor";
import { ReportViewer } from "./components/ReportViewer";
import { CodeBrowser } from "./components/CodeBrowser";
import { CliSimulator } from "./components/CliSimulator";
import { TestMetrics, RawResultLog, RepositoryFile } from "./types";

const DEFAULT_CONFIG_YAML = `name: "Built-in Express Mock Server Benchmark"
base_url: "http://localhost:3000/api/mock"
timeout: 5.0
concurrent_users: 15
number_of_requests: 150

headers:
  User-Agent: "AsyncAPITester/1.0"
  Accept: "application/json"

endpoints:
  - name: "Status Check 200"
    path: "/status/200"
    method: "GET"

  - name: "Fetch Mock User Data"
    path: "/get"
    method: "GET"
    headers:
      X-Test-Key: "benchmark_val"

  - name: "Submit Payload Data"
    path: "/post"
    method: "POST"
    headers:
      Content-Type: "application/json"
    body:
      event: "order_created"
      amount: 149.99

  - name: "Update Config"
    path: "/put"
    method: "PUT"
    body:
      status: "active"

  - name: "Purge Session"
    path: "/delete"
    method: "DELETE"

  - name: "Chaos Resilience Test (Random 200/400/500/Timeout)"
    path: "/chaos"
    method: "GET"
`;

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "config" | "report" | "code" | "cli">("dashboard");
  const [configYaml, setConfigYaml] = useState<string>(DEFAULT_CONFIG_YAML);
  const [metrics, setMetrics] = useState<TestMetrics | null>(null);
  const [logs, setLogs] = useState<RawResultLog[]>([]);
  const [markdownReport, setMarkdownReport] = useState<string>("");
  const [files, setFiles] = useState<RepositoryFile[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Fetch initial repo files
  //useEffect(() => {
    //fetch("/api/files")
      //.then((res) => res.json())
      //.then((data) => {
        //if (data.files) {
          //setFiles(data.files);
          //const reportFile = data.files.find((f: any) => f.path === "reports/report.md");
          //if (reportFile) {
            //setMarkdownReport(reportFile.content);
          //}
        //}
      //})
      //.catch((err) => console.error("Failed to load repo files:", err));
  //}, []);

  // Run Load Test
  const handleRunTest = async () => {
    setIsRunning(true);
    try {
      const res = await fetch("/api/run-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config_content: configYaml,
          format: "yaml",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMetrics(data.metrics);
        setLogs(data.results || []);
        if (data.markdownReport) {
          setMarkdownReport(data.markdownReport);
        }
      } else {
        alert(data.error || "Execution failed");
      }
    } catch (err: any) {
      alert(`Network / Engine error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Run automated test on initial mount for instant feedback
  //useEffect(() => {
  //  handleRunTest();
  //}, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} files={files} />

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

        {activeTab === "report" && <ReportViewer markdownReport={markdownReport} />}

        {activeTab === "code" && <CodeBrowser files={files} />}

        {activeTab === "cli" && <CliSimulator onRunTest={handleRunTest} isRunning={isRunning} />}
      </main>

      <footer className="h-12 border-t border-slate-800 bg-slate-900 px-6 flex items-center justify-between text-[11px] font-medium">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-wider">STATUS:</span>
            <span className="text-emerald-400 font-bold font-mono uppercase">
              {isRunning ? "EXEC_ACTIVE" : "IDLE"}
            </span>
          </div>
          <div className="flex items-center gap-2 hidden sm:flex">
            <span className="text-slate-500 uppercase tracking-wider">MEMORY:</span>
            <span className="text-slate-300 font-mono">42.1 MB</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 uppercase tracking-wider">ENGINE:</span>
            <span className="text-slate-300 font-mono">Python 3.11.4 Asyncio</span>
          </div>
        </div>
        <div className="text-slate-500 font-mono hidden md:block">
          aiohttp + PyYAML + Pytest
        </div>
      </footer>
    </div>
  );
}
