// src/app/api/files/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const BASE_PATH = 'files';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let requestedPath = searchParams.get('path') || '';
    
    // Remove the base path prefix if it exists in the request
    if (requestedPath.startsWith('/files')) {
      requestedPath = requestedPath.slice('/files'.length);
    }

    // Construct the full path
    const fullPath = path.join(process.cwd(), BASE_PATH, requestedPath);

    // Security check to prevent directory traversal
    const baseDir = path.join(process.cwd(), BASE_PATH);
    if (!fullPath.startsWith(baseDir)) {
      return NextResponse.json(
        { error: 'Access denied - path outside allowed directory' }, 
        { status: 403 }
      );
    }

    // Check if path exists
    try {
      await fs.access(fullPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Path does not exist' }, 
        { status: 404 }
      );
    }

    // Get file/directory stats
    const stats = await fs.stat(fullPath);

    // If it's a file, we'll handle it differently
    if (stats.isFile()) {
      return NextResponse.json({
        files: [{
          name: path.basename(fullPath),
          path: requestedPath,
          size: stats.size,
          isDirectory: false,
          modifiedTime: stats.mtime.toISOString(),
        }]
      });
    }

    // Read directory contents
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    
    // Process each entry
    const files = await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(requestedPath, entry.name);
        const fullEntryPath = path.join(fullPath, entry.name);
        const entryStats = await fs.stat(fullEntryPath);

        return {
          name: entry.name,
          // Ensure the path is relative to the base directory
          path: path.join('/files', requestedPath, entry.name)
            .replace(/\\/g, '/'), // Convert Windows backslashes to forward slashes
          size: entryStats.size,
          isDirectory: entry.isDirectory(),
          modifiedTime: entryStats.mtime.toISOString(),
        };
      })
    );

    // Sort directories first, then files alphabetically
    files.sort((a, b) => {
      if (a.isDirectory === b.isDirectory) {
        return a.name.localeCompare(b.name, undefined, { 
          numeric: true,
          sensitivity: 'base'
        });
      }
      return a.isDirectory ? -1 : 1;
    });

    // Return the processed files list
    return NextResponse.json({
      files,
      currentPath: '/files' + requestedPath
    });

  } catch (error) {
    console.error('Error accessing files:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error }, 
      { status: 500 }
    );
  }
}