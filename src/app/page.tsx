"use client";

import { useState, useEffect } from "react";
import { FileList } from "@/components/FileList";
import { FileItem, SystemStats as SystemStatsType } from "@/types";
import { Navbar } from "@/components/Navbar";
import { SystemStats } from "@/components/SystemStats";

export default function Home() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [systemStats, setSystemStats] = useState<SystemStatsType>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    serverAddress: "",
  });

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await fetch(
        `/api/files?path=${encodeURIComponent(currentPath)}`
      );
      const data = await response.json();
      setFiles(data.files);
    };

    const fetchStats = async () => {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setSystemStats(data);
    };

    fetchFiles();
    fetchStats();

    const statsInterval = setInterval(fetchStats, 5000);
    return () => clearInterval(statsInterval);
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    if (path === "..") {
      const parentPath = currentPath.split("/").slice(0, -2).join("/") + "/";
      setCurrentPath(parentPath || "/");
    } else {
      setCurrentPath(path.endsWith("/") ? path : `${path}/`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar serverAddress={systemStats.serverAddress} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-emerald-400">
              File Browser
            </h2>
            <span className="font-mono text-sm text-gray-400">
              Current Path: {currentPath}
            </span>
          </div>

          <FileList
            files={files}
            currentPath={currentPath}
            onNavigate={handleNavigate}
          />
        </div>
      </main>

      <SystemStats stats={systemStats} />
    </div>
  );
}
