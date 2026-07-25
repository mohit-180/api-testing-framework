import React, { useState } from "react";
import { Settings, Play, Check, AlertCircle, FileCode, Layers } from "lucide-react";
import * as jsYaml from "js-yaml";

interface ConfigEditorProps {
  configYaml: string;
  setConfigYaml: (val: string) => void;
  onRunTest: () => void;
  isRunning: boolean;
}

const PRESETS = {
  mock: `name: "Built-in Express Mock Server Benchmark"
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
`,
  httpbin: `name: "Httpbin Public API Benchmark"
base_url: "https://httpbin.org"
timeout: 6.0
concurrent_users: 10
number_of_requests: 50

headers:
  User-Agent: "AsyncAPITester/1.0"

endpoints:
  - name: "Health Check"
    path: "/status/200"
    method: "GET"

  - name: "Get Inspection"
    path: "/get"
    method: "GET"

  - name: "Post Telemetry"
    path: "/post"
    method: "POST"
    body:
      service: "payment-gateway"
      status: "healthy"
`,
};

export const ConfigEditor: React.FC<ConfigEditorProps> = ({
  configYaml,
  setConfigYaml,
  onRunTest,
  isRunning,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  const handleTextChange = (val: string) => {
    setConfigYaml(val);
    try {
      const parsed: any = jsYaml.load(val);
      if (!parsed || typeof parsed !== "object") {
        setError("Invalid YAML structure: Must be a root object.");
        setIsValid(false);
      } else if (!parsed.base_url) {
        setError("Validation Warning: Missing required field 'base_url'");
        setIsValid(false);
      } else if (!parsed.endpoints || !Array.isArray(parsed.endpoints)) {
        setError("Validation Warning: Missing required array 'endpoints'");
        setIsValid(false);
      } else {
        setError(null);
        setIsValid(true);
      }
    } catch (e: any) {
      setError(`YAML Syntax Error: ${e.message}`);
      setIsValid(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>Test Plan Configuration Editor</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Author load test plans in YAML or JSON format. Config loader validates schemas and endpoint methods.
          </p>
        </div>

        {/* Preset Selectors */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-mono uppercase tracking-wider hidden sm:inline">Load Preset:</span>
          <button
            onClick={() => handleTextChange(PRESETS.mock)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Built-in Mock API</span>
          </button>
          <button
            onClick={() => handleTextChange(PRESETS.httpbin)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Httpbin Public</span>
          </button>
        </div>
      </div>

      {/* Editor Main */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-semibold text-slate-300">config/test_plan.yaml</span>
            {isValid ? (
              <span className="inline-flex items-center space-x-1 text-[11px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                <Check className="w-3 h-3" />
                <span>Valid YAML</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-[11px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/20 font-mono">
                <AlertCircle className="w-3 h-3" />
                <span>Syntax Issue</span>
              </span>
            )}
          </div>

          <button
            onClick={onRunTest}
            disabled={!isValid || isRunning}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              !isValid || isRunning
                ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20"
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Test Plan</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 font-mono">
            {error}
          </div>
        )}

        <textarea
          value={configYaml}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={18}
          className="w-full bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors resize-y leading-relaxed"
          placeholder="Type or paste YAML configuration..."
        />
      </div>
    </div>
  );
};
