export interface FileItem {
    name: string;
    path: string;
    size: number;
    isDirectory: boolean;
    modifiedTime: string;
  }
  
  export interface SystemStats {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    serverAddress: string;
  }