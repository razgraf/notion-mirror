import fs from 'fs'
import path from 'path'
import { getDataPath } from '../config'

export interface PageContent {
  title: string
  content: string
  images: string[]
}

function extractTitleFromContent(content: string): string {
  const h1Match = content.match(/^#\s+(.+)$/m)
  return h1Match ? h1Match[1].trim() : 'Untitled'
}

function extractImages(content: string, basePath: string): string[] {
  const images: string[] = []
  const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
  let match

  while ((match = imgRegex.exec(content)) !== null) {
    const imgPath = match[2]
    // Only include local images (relative paths)
    if (!imgPath.startsWith('http://') && !imgPath.startsWith('https://')) {
      images.push(imgPath)
    }
  }

  return images
}

export function resolveFilePath(relativePath: string): string | null {
  const dataPath = getDataPath()
  const fullPath = path.join(dataPath, relativePath)

  if (fs.existsSync(fullPath)) {
    return fullPath
  }

  return null
}

export function readMarkdownFile(filePath: string): PageContent | null {
  const fullPath = resolveFilePath(filePath)

  if (!fullPath) {
    return null
  }

  const content = fs.readFileSync(fullPath, 'utf-8')
  const title = extractTitleFromContent(content)
  const basePath = path.dirname(filePath)
  const images = extractImages(content, basePath)

  return { title, content, images }
}

export function findFileByUuid(uuid: string): string | null {
  const dataPath = getDataPath()
  const shortUuid = uuid.slice(0, 8)
  const fullUuid = uuid.replace(/-/g, '')

  function searchDir(dir: string): string | null {
    const entries = fs.readdirSync(dir, { withFileTypes: true })

    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        const found = searchDir(entryPath)
        if (found) return found
      } else if (entry.name.endsWith('.md')) {
        const nameWithoutExt = entry.name.replace('.md', '')
        if (
          nameWithoutExt.includes(fullUuid) ||
          nameWithoutExt.toLowerCase().includes(shortUuid)
        ) {
          return path.relative(dataPath, entryPath)
        }
      }
    }

    return null
  }

  return searchDir(dataPath)
}
