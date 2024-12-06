import React from "react";
import {
  Folder,
  File,
  Download,
  ArrowUp,
  HardDrive,
  Clock,
} from "lucide-react";
import { FileItem } from "@/types";

interface FileListProps {
  files: FileItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  currentPath,
  onNavigate,
}) => {
  const formatSize = (size: number): string => {
    const units = ["B", "KB", "MB", "GB"];
    let formattedSize = size;
    let unitIndex = 0;

    while (formattedSize >= 1024 && unitIndex < units.length - 1) {
      formattedSize /= 1024;
      unitIndex++;
    }

    return `${formattedSize.toFixed(1)} ${units[unitIndex]}`;
  };

  if (!files) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {currentPath !== "/" && (
        <div
          onClick={() => onNavigate("..")}
          className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <ArrowUp className="w-5 h-5 text-emerald-500" />
            <span className="text-gray-200">..</span>
          </div>
          <span className="hidden sm:inline text-sm text-gray-400 font-mono">
            Parent Directory
          </span>
        </div>
      )}

      {files.map((file) => (
        <div
          key={file.path}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            {file.isDirectory ? (
              <Folder className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <File className="w-5 h-5 text-blue-400 flex-shrink-0" />
            )}
            <button
              onClick={() => onNavigate(file.path)}
              className="text-gray-200 hover:text-emerald-400 truncate max-w-[200px] sm:max-w-[300px] text-left"
            >
              {file.name}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-2 sm:mt-0 pl-8 sm:pl-0">
            {/* File details for mobile */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400 font-mono">
              <HardDrive className="w-4 h-4 sm:hidden" />
              <span>{formatSize(file.size)}</span>
            </div>

            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400 font-mono">
              <Clock className="w-4 h-4 sm:hidden" />
              <span>{new Date(file.modifiedTime).toLocaleString()}</span>
            </div>

            {!file.isDirectory && (
              <a
                href={`/api/download?path=${encodeURIComponent(file.path)}`}
                className="flex items-center px-3 py-1 bg-gray-600 hover:bg-emerald-600 rounded text-sm transition-colors w-full sm:w-auto justify-center sm:justify-start"
              >
                <Download className="w-4 h-4 mr-1" />
                <span>Download</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
