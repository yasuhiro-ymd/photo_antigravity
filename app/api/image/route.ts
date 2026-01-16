import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import heicConvert from 'heic-convert';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const filePathParam = searchParams.get('file');

    if (!filePathParam) {
        return new NextResponse('Missing file parameter', { status: 400 });
    }

    // SAFETY: Remove leading slashes to prevent absolute path traversal issues when joining
    // and ensure we are always relative to public directory
    const cleanPath = filePathParam.replace(/^\/+/, '');
    const fullPath = path.join(process.cwd(), 'public', cleanPath);

    // SAFETY: Ensure the resolved path is still within the public directory
    if (!fullPath.startsWith(path.join(process.cwd(), 'public'))) {
        return new NextResponse('Invalid file path', { status: 403 });
    }

    try {
        const fileBuffer = await fs.readFile(fullPath);
        const ext = path.extname(fullPath).toLowerCase();

        if (ext === '.heic') {
            const outputBuffer = await heicConvert({
                buffer: fileBuffer,
                format: 'JPEG',
                quality: 0.8 // OPTIMIZE: Good balance between size and quality
            });
            return new NextResponse(outputBuffer as any, {
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Cache-Control': 'public, max-age=31536000, immutable',
                },
            });
        }

        // Determine content type for otherimages
        let contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.svg') contentType = 'image/svg+xml';

        return new NextResponse(fileBuffer as any, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000',
            },
        });

    } catch (error) {
        console.error(`Error serving image ${fullPath}:`, error);
        // Don't expose internal paths in production errors
        return new NextResponse('Error serving image', { status: 404 });
    }
}
