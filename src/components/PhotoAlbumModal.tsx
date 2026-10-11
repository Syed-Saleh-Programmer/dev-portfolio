"use client";

import { useState } from "react";
import { X, ZoomIn, Camera } from "lucide-react";
import { InteractiveCard } from "./InteractiveCard";

interface Photo {
  image: string;
  caption?: string;
  rotation?: string;
}

export function PhotoAlbumModal({ photos }: { photos: Photo[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <div className="py-6 flex flex-wrap gap-6 justify-center sm:justify-start items-center">
        {photos.map((photo, pIdx) => {
          return (
            <InteractiveCard
              key={pIdx}
              onClick={() => setSelectedPhoto(photo)}
              roundedClassName="rounded-2xl"
              className="glass-bento-card border border-[var(--border-subtle)] hover:border-[var(--border-hover)] p-3 pb-4 rounded-2xl w-full max-w-[300px] cursor-pointer shadow-md transition-all duration-300"
            >
              {/* Photo Image Container */}
              <div className="w-full aspect-[4/3] overflow-hidden rounded-xl bg-[var(--bg-subtle)] mb-3 relative group/zoom">
                <img
                  src={photo.image}
                  alt={photo.caption || "Album photo"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/zoom:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="p-2 rounded-full bg-white/20 backdrop-blur-md">
                    <ZoomIn size={18} />
                  </div>
                </div>
              </div>

              {/* Minimal Clean Caption */}
              {photo.caption && (
                <p className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors font-mono leading-tight px-1 text-center font-medium">
                  {photo.caption}
                </p>
              )}
            </InteractiveCard>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <Camera size={14} />
                <span>Album Inspector</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] hover:bg-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black/40 max-h-[70vh] flex items-center justify-center">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.caption || "Inspected photo"}
                className="max-h-[68vh] w-auto object-contain rounded-xl"
              />
            </div>

            {selectedPhoto.caption && (
              <p className="text-sm font-mono text-[var(--text-secondary)] text-center pt-2">
                &ldquo;{selectedPhoto.caption}&rdquo;
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
