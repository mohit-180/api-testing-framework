import React from "react";
import {
  Play,
  FileCode,
  FileText,
  Terminal,
  Download,
  Settings,
  Activity,
  Zap,
} from "lucide-react";
import JSZip from "jszip";
import { RepositoryFile } from "../types";

interface HeaderProps {
  activeTab: "dashboard" | "config" | "report" | "code" | "cli";
  setActiveTab: (tab: "dashboard" | "config" | "report" | "code" | "cli") => void;
  files: RepositoryFile[];
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, files }) => {
  const handleDownloadZip = async () => {
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.path, file.content);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "api-testing-framework.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white">
                Async API Load Framework
              </h1>
              <span className="text-slate-500 font-normal text-xs">v1.0.4</span>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                  Engine Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Load Tester</span>
          </button>

          <button
            onClick={() => setActiveTab("config")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "config"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Test Plans</span>
          </button>

          <button
            onClick={() => setActiveTab("report")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "report"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Report.md</span>
          </button>

          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "code"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Python Repo</span>
          </button>

          <button
            onClick={() => setActiveTab("cli")}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "cli"
                ? "bg-emerald-500 text-slate-950 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>CLI Terminal</span>
          </button>
        </nav>

        {/* Action Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadZip}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-white text-slate-950 text-xs font-bold rounded-lg transition-colors shadow"
            title="Download clean repository as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Repo (.zip)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
