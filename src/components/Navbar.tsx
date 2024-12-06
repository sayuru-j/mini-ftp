import React from 'react';

interface NavbarProps {
  serverAddress: string;
}

export const Navbar: React.FC<NavbarProps> = ({ serverAddress }) => {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-mono font-bold text-emerald-500">DevServer</span>
            <div className="h-2 w-16 bg-gray-700 rounded-full ml-4 overflow-hidden">
              <div className="h-full w-1/2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
          </div>
          <div className="flex space-x-4">
            <span className="font-mono text-sm text-gray-400">{serverAddress}</span>
          </div>
        </div>
      </div>
    </nav>
  );
};