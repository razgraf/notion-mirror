'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { NavNode } from '@/lib/parser/index-html'

interface WorkspaceData {
  id: string
  name: string
  tree: NavNode[]
}

export default function Home() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null)

  useEffect(() => {
    fetch('/api/nav')
      .then((res) => res.json())
      .then(setWorkspace)
  }, [])

  if (!workspace) {
    return <div className="text-text-secondary">Loading...</div>
  }

  // Get top-level pages (skip sections without file paths)
  const topLevelPages = workspace.tree.flatMap((node) => {
    if (node.filePath) return [node]
    // If it's a section header, return its immediate children
    return node.children.filter((child) => child.filePath)
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-text-primary mb-2">{workspace.name}</h1>
      <p className="text-text-secondary mb-8">
        Browse the workspace documentation below or use{' '}
        <kbd className="bg-bg-tertiary px-1.5 py-0.5 rounded text-sm">
          {typeof navigator !== 'undefined' && navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}K
        </kbd>{' '}
        to search.
      </p>

      <div className="grid gap-4">
        {workspace.tree.map((section) => (
          <div key={section.id} className="mb-6">
            {/* Section header */}
            {!section.filePath && section.children.length > 0 && (
              <h2 className="text-lg font-semibold text-text-primary mb-3">{section.title}</h2>
            )}

            {/* Section pages or direct page */}
            {section.filePath ? (
              <PageCard node={section} />
            ) : (
              <div className="grid gap-2">
                {section.children
                  .filter((child) => child.filePath)
                  .map((child) => (
                    <PageCard key={child.id} node={child} />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function PageCard({ node }: { node: NavNode }) {
  return (
    <Link
      href={`/page/${node.slug}`}
      className="block p-4 bg-bg-secondary rounded-lg border border-border hover:border-accent/50 transition-colors group"
    >
      <div className="flex items-center gap-3">
        <span className="text-text-secondary group-hover:text-accent transition-colors">
          {node.isCsv ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          )}
        </span>
        <span className="text-text-primary group-hover:text-accent transition-colors">
          {node.title}
        </span>
        {node.children.length > 0 && (
          <span className="ml-auto text-xs text-text-secondary">
            {node.children.length} {node.children.length === 1 ? 'page' : 'pages'}
          </span>
        )}
      </div>
    </Link>
  )
}
