import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path') || '';
    const fullPath = path.join(process.cwd(), filePath);

    // Security check
    if (!fullPath.startsWith(process.cwd())) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const fileBuffer = await fs.readFile(fullPath);
    const fileName = path.basename(fullPath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Disposition': `attachment; filename=${fileName}`,
        'Content-Type': 'application/octet-stream',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
