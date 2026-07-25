import React, { useState } from "react";
import {
  FileCode,
  Folder,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  FileText,
  Terminal,
  Download,
  FolderGit2,
} from "lucide-react";
import JSZip from "jszip";
import { RepositoryFile } from "../types";

interface CodeBrowserProps {
  files: RepositoryFile[];
}

export const CodeBrowser: React.FC<CodeBrowserProps> = ({ files }) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>("main.py");
  const [copied, setCopied] = useState<boolean>(false);

  const selectedFile = files.find((f) => f.path === selectedFilePath) || files[0];

  const handleCopyFile = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    files.forEach((f) => {
      zip.file(f.path, f.content);
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

  // Group files into directories for sidebar
  const rootFiles = files.filter((f) => !f.path.includes("/"));
  const coreFiles = files.filter((f) => f.path.startsWith("core/"));
  const configFiles = files.filter((f) => f.path.startsWith("config/"));
  const testFiles = files.filter((f) => f.path.startsWith("tests/"));
  const reportFiles = files.filter((f) => f.path.startsWith("reports/"));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-emerald-400" />
            <span>Python Repository Explorer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse human-written, modular Python 3.11+ source code for recruiters and portfolio inspection.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-lg shadow-md transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Entire Repository (.zip)</span>
        </button>
      </div>

      {/* Main Split IDE View */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-4 min-h-[550px]">
        {/* Left Sidebar Tree */}
        <div className="bg-slate-950/90 border-r border-slate-800 p-4 space-y-4 text-xs font-mono">
          <div className="font-semibold text-slate-500 uppercase tracking-widest text-[10px] px-2">
            api-testing-framework/
          </div>

          <div className="space-y-2">
            {/* Core folder */}
            <div>
              <div className="flex items-center space-x-1.5 text-slate-300 font-medium px-2 py-1">
                <Folder className="w-3.5 h-3.5 text-amber-400" />
                <span>core/</span>
              </div>
              <div className="ml-4 space-y-0.5 border-l border-slate-800 pl-2">
                {coreFiles.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFilePath(f.path)}
                    className={`w-full text-left px-2 py-1 rounded font-mono truncate transition-colors ${
                      selectedFilePath === f.path
                        ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {f.path.replace("core/", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Config folder */}
            <div>
              <div className="flex items-center space-x-1.5 text-slate-300 font-medium px-2 py-1">
                <Folder className="w-3.5 h-3.5 text-blue-400" />
                <span>config/</span>
              </div>
              <div className="ml-4 space-y-0.5 border-l border-slate-800 pl-2">
                {configFiles.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFilePath(f.path)}
                    className={`w-full text-left px-2 py-1 rounded font-mono truncate transition-colors ${
                      selectedFilePath === f.path
                        ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {f.path.replace("config/", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Tests folder */}
            <div>
              <div className="flex items-center space-x-1.5 text-slate-300 font-medium px-2 py-1">
                <Folder className="w-3.5 h-3.5 text-emerald-400" />
                <span>tests/</span>
              </div>
              <div className="ml-4 space-y-0.5 border-l border-slate-800 pl-2">
                {testFiles.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFilePath(f.path)}
                    className={`w-full text-left px-2 py-1 rounded font-mono truncate transition-colors ${
                      selectedFilePath === f.path
                        ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {f.path.replace("tests/", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Reports folder */}
            <div>
              <div className="flex items-center space-x-1.5 text-slate-300 font-medium px-2 py-1">
                <Folder className="w-3.5 h-3.5 text-purple-400" />
                <span>reports/</span>
              </div>
              <div className="ml-4 space-y-0.5 border-l border-slate-800 pl-2">
                {reportFiles.map((f) => (
                  <button
                    key={f.path}
                    onClick={() => setSelectedFilePath(f.path)}
                    className={`w-full text-left px-2 py-1 rounded font-mono truncate transition-colors ${
                      selectedFilePath === f.path
                        ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    {f.path.replace("reports/", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Root Files */}
            <div className="pt-2 border-t border-slate-800 space-y-0.5">
              {rootFiles.map((f) => (
                <button
                  key={f.path}
                  onClick={() => setSelectedFilePath(f.path)}
                  className={`w-full text-left px-2 py-1 rounded font-mono truncate transition-colors ${
                    selectedFilePath === f.path
                      ? "bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  {f.path}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Code Content Pane */}
        <div className="md:col-span-3 flex flex-col bg-slate-950">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 text-xs font-mono">
            <span className="text-emerald-400 font-semibold flex items-center space-x-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>{selectedFile.path}</span>
            </span>

            <button
              onClick={handleCopyFile}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-xs font-semibold transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 overflow-x-auto flex-1 bg-slate-950">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre font-normal">
              {selectedFile ? selectedFile.content : "No file selected."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
