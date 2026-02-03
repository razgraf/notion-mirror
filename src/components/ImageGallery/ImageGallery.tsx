'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[]
  basePath: string
}

export function ImageGallery({ images, basePath }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const getImageUrl = (src: string) => {
    // Construct the full path relative to the page's directory
    const fullPath = src.startsWith('/') ? src.slice(1) : `${basePath}/${src}`
    return `/api/image?path=${encodeURIComponent(fullPath)}`
  }

  return (
    <>
      <div className="image-gallery">
        {images.map((src, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className="block w-full overflow-hidden rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <img
              src={getImageUrl(src)}
              alt={`Image ${index + 1}`}
              className="w-full h-auto object-cover aspect-[16/10]"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {selectedIndex > 0 && (
            <button
              className="absolute left-4 text-white/70 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex(selectedIndex - 1)
              }}
              aria-label="Previous"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {selectedIndex < images.length - 1 && (
            <button
              className="absolute right-4 text-white/70 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex(selectedIndex + 1)
              }}
              aria-label="Next"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <img
            src={getImageUrl(images[selectedIndex])}
            alt={`Image ${selectedIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
