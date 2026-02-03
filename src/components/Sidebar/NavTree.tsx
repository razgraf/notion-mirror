'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavNode } from '@/lib/parser/index-html'

interface NavTreeProps {
  nodes: NavNode[]
  level?: number
  currentSlug?: string
  expandedNodes: Set<string>
  onToggle: (id: string) => void
}

function NavItem({
  node,
  level,
  currentSlug,
  expandedNodes,
  onToggle,
}: {
  node: NavNode
  level: number
  currentSlug?: string
  expandedNodes: Set<string>
  onToggle: (id: string) => void
}) {
  const hasChildren = node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)
  const isActive = node.slug === currentSlug
  // Clickable if has file OR has children (we can show children table)
  const isClickable = !node.isExternal && (node.filePath || hasChildren)

  const paddingLeft = `${level * 12 + 8}px`

  const handleNavClick = () => {
    // Toggle expansion when navigating to a page with children
    if (hasChildren && !isExpanded) {
      onToggle(node.id)
    }
  }

  return (
    <div>
      <div
        className={`
          flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer transition-colors
          ${isActive ? 'bg-hover' : 'hover:bg-hover'}
        `}
        style={{ paddingLeft }}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              onToggle(node.id)
            }}
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-text-secondary hover:text-text-primary"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        {!hasChildren && <span className="w-5" />}

        {node.isExternal ? (
          <a
            href={node.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 truncate text-sm text-text-secondary hover:text-text-primary external-link"
          >
            {node.title}
          </a>
        ) : isClickable ? (
          <Link
            href={`/page/${node.slug}`}
            onClick={handleNavClick}
            className={`flex-1 truncate text-sm ${
              isActive ? 'text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {node.title}
          </Link>
        ) : (
          <span className="flex-1 truncate text-sm text-text-secondary">
            {node.title}
          </span>
        )}

        {node.isCsv && (
          <span className="text-xs text-text-secondary bg-bg-tertiary px-1.5 py-0.5 rounded">
            CSV
          </span>
        )}
      </div>

      {hasChildren && isExpanded && (
        <NavTree
          nodes={node.children}
          level={level + 1}
          currentSlug={currentSlug}
          expandedNodes={expandedNodes}
          onToggle={onToggle}
        />
      )}
    </div>
  )
}

export function NavTree({ nodes, level = 0, currentSlug, expandedNodes, onToggle }: NavTreeProps) {
  return (
    <div>
      {nodes.map((node) => (
        <NavItem
          key={node.id}
          node={node}
          level={level}
          currentSlug={currentSlug}
          expandedNodes={expandedNodes}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}

export function useExpandedNodes(tree: NavNode[], currentSlug?: string) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    // Expand first level by default
    const initial = new Set<string>()
    tree.forEach((node) => initial.add(node.id))
    return initial
  })

  // Auto-expand path to current page
  useEffect(() => {
    if (!currentSlug) return

    function findPath(nodes: NavNode[], path: string[] = []): string[] | null {
      for (const node of nodes) {
        const newPath = [...path, node.id]
        if (node.slug === currentSlug) {
          return newPath
        }
        const found = findPath(node.children, newPath)
        if (found) return found
      }
      return null
    }

    const path = findPath(tree)
    if (path) {
      setExpandedNodes((prev) => {
        const next = new Set(prev)
        path.forEach((id) => next.add(id))
        return next
      })
    }
  }, [currentSlug, tree])

  const toggle = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const expandAll = () => {
    function collectIds(nodes: NavNode[]): string[] {
      return nodes.flatMap((node) => [node.id, ...collectIds(node.children)])
    }
    setExpandedNodes(new Set(collectIds(tree)))
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  return { expandedNodes, toggle, expandAll, collapseAll }
}
