import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getDataPath } from '@/lib/config'

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const imagePath = searchParams.get('path')

  if (!imagePath) {
    return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 })
  }

  const dataPath = getDataPath()
  const decodedPath = decodeURIComponent(imagePath)
  const fullPath = path.join(dataPath, decodedPath)

  // Security check: ensure the path is within the data directory
  const resolvedPath = path.resolve(fullPath)
  const resolvedDataPath = path.resolve(dataPath)

  if (!resolvedPath.startsWith(resolvedDataPath)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 403 })
  }

  if (!fs.existsSync(resolvedPath)) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 })
  }

  const ext = path.extname(resolvedPath).toLowerCase()
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream'

  const fileBuffer = fs.readFileSync(resolvedPath)

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
