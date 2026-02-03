'use client'

import Link from 'next/link'
import type { NavNode } from '@/lib/parser/index-html'

interface BreadcrumbsProps {
  items: NavNode[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-text-secondary mb-4 flex-wrap">
      <Link href="/" className="hover:text-text-primary transition-colors">
        Home
      </Link>

      {items.map((item, index) => (
        <span key={item.id} className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {index === items.length - 1 ? (
            <span className="text-text-primary">{item.title}</span>
          ) : item.filePath ? (
            <Link
              href={`/page/${item.slug}`}
              className="hover:text-text-primary transition-colors"
            >
              {item.title}
            </Link>
          ) : (
            <span>{item.title}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
