import path from 'path'
import fs from 'fs'

export interface NotionPreviewConfig {
  dataPath: string
  theme: 'dark' | 'light'
  defaultCsvVariant: 'all' | 'filtered'
  features: {
    search: boolean
    breadcrumbs: boolean
    imageGallery: boolean
    headingAnchors: boolean
  }
}

const defaultConfig: NotionPreviewConfig = {
  dataPath: './data',
  theme: 'dark',
  defaultCsvVariant: 'all',
  features: {
    search: true,
    breadcrumbs: true,
    imageGallery: true,
    headingAnchors: true,
  },
}

let cachedConfig: NotionPreviewConfig | null = null

export function getConfig(): NotionPreviewConfig {
  if (cachedConfig) return cachedConfig

  // For server-side, try to read the config file directly
  const configPath = path.join(process.cwd(), 'notion-preview.config.js')

  if (fs.existsSync(configPath)) {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8')
      // Parse the config as a simple object (supports module.exports = {...})
      const match = configContent.match(/module\.exports\s*=\s*(\{[\s\S]*\})/)
      if (match) {
        // Use Function constructor to safely evaluate the config object
        const evalConfig = new Function(`return ${match[1]}`)()
        cachedConfig = {
          ...defaultConfig,
          ...evalConfig,
          features: { ...defaultConfig.features, ...evalConfig.features },
        }
        return cachedConfig!
      }
    } catch (e) {
      console.warn('Failed to load config:', e)
    }
  }

  cachedConfig = defaultConfig
  return cachedConfig
}

export function getDataPath(): string {
  const config = getConfig()
  return path.isAbsolute(config.dataPath)
    ? config.dataPath
    : path.join(process.cwd(), config.dataPath)
}
