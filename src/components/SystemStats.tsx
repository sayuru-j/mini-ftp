import React from 'react';
import { Cpu, MemoryStick, HardDrive, Globe } from 'lucide-react';
import { SystemStats as SystemStatsType } from '@/types';

interface SystemStatsProps {
  stats: SystemStatsType;
}

export const SystemStats: React.FC<SystemStatsProps> = ({ stats }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between text-sm font-mono text-gray-400">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>CPU: {stats.cpuUsage}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <MemoryStick className="w-4 h-4" />
            <span>Memory: {stats.memoryUsage}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4" />
            <span>Disk: {stats.diskUsage}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>{stats.serverAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};