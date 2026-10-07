'use client'

import React from 'react'
import { X } from 'lucide-react'
import { Note } from '@/lib/types/note'
import { NoteEditor } from '@/components/note-editor'
import { Card } from '@workspace/ui/components/card'

interface NoteEditorModalProps {
  isOpen: boolean
  onClose: () => void
  note: Note | null
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
  onToggleFavorite: (id: string) => void
  onOpenQuickCap: () => void
}

export function NoteEditorModal({
  isOpen,
  onClose,
  note,
  onUpdate,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onOpenQuickCap
}: NoteEditorModalProps) {
  if (!isOpen || !note) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl h-[85vh] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col">
        {/* Close Handle */}
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 z-10 p-1.5 rounded-full bg-zinc-100 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          title="Close note details"
        >
          <X className="size-4" />
        </button>

        <div className="flex-1 h-full overflow-hidden">
          <NoteEditor
            note={note}
            onUpdate={onUpdate}
            onDelete={(id) => {
              onDelete(id)
              onClose()
            }}
            onTogglePin={onTogglePin}
            onToggleFavorite={onToggleFavorite}
            onOpenQuickCap={onOpenQuickCap}
          />
        </div>
      </div>
    </div>
  )
}
