'use client'

import React from 'react'
import { Pin, Star, Trash2, Clock, Sparkles, FolderOpen } from 'lucide-react'
import { Note } from '@/lib/types/note'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@workspace/ui/components/card'
import { NoteTypeIcon } from '@/components/note-type-icon'
import { cn } from '@workspace/ui/lib/utils'

interface NoteCardProps {
  note: Note
  isActive: boolean
  onSelect: () => void
  onTogglePin: () => void
  onToggleFavorite: () => void
  onDelete: () => void
  defaultShowPreview?: boolean
}

export function NoteCard({
  note,
  isActive,
  onSelect,
  onTogglePin,
  onToggleFavorite,
  onDelete
}: NoteCardProps) {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })

  return (
    <Card
      onClick={onSelect}
      className={cn(
        "cursor-pointer group relative transition-all duration-200 hover:shadow-md flex flex-col justify-between p-3 select-none",
        isActive
          ? "ring-1.5 ring-zinc-900 border-transparent dark:ring-zinc-100 bg-white dark:bg-zinc-900"
          : "bg-white/90 hover:border-zinc-300/90 dark:bg-zinc-900/90 dark:border-zinc-800/80 dark:hover:border-zinc-700"
      )}
    >
      {/* Top Header Row: Icon, Project & Actions */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <NoteTypeIcon type={note.type || 'note'} size="sm" />

          {note.projectName && (
            <span className="inline-flex items-center gap-1 text-[0.62rem] px-2 py-0.5 rounded-full bg-zinc-100/80 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300 font-medium tracking-tight truncate max-w-[140px]">
              <FolderOpen className="size-2.5 text-zinc-400 shrink-0" strokeWidth={2.5} />
              <span className="truncate">{note.projectName}</span>
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-0.5 opacity-70 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={e => {
              e.stopPropagation()
              onTogglePin()
            }}
            className={cn(
              "p-1 rounded-full transition-colors cursor-pointer",
              note.isPinned
                ? "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60"
                : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <Pin className="size-3" strokeWidth={2.5} />
          </button>

          <button
            onClick={e => {
              e.stopPropagation()
              onToggleFavorite()
            }}
            className={cn(
              "p-1 rounded-full transition-colors cursor-pointer",
              note.isFavorite
                ? "text-amber-500 bg-amber-50 dark:bg-amber-950/60"
                : "text-zinc-400 hover:text-amber-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
            title={note.isFavorite ? "Unstar note" : "Star note"}
          >
            <Star className={cn("size-3", note.isFavorite && "fill-amber-500")} strokeWidth={2.5} />
          </button>

          <button
            onClick={e => {
              e.stopPropagation()
              onDelete()
            }}
            className="p-1 rounded-full text-zinc-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            title="Delete Note"
          >
            <Trash2 className="size-3" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Note Title */}
      <CardTitle className="text-[0.84rem] font-semibold tracking-tight text-zinc-900/90 dark:text-zinc-100 line-clamp-1 group-hover:text-zinc-900 mb-1">
        {note.title}
      </CardTitle>

      {/* Preview Content Body */}
      <div className="flex-1 my-0.5">
        <p className="text-[0.78rem] text-zinc-500 dark:text-zinc-400 font-normal line-clamp-2 leading-relaxed tracking-tight">
          {note.content}
        </p>

        {note.type === 'credential' && note.credentialData?.username && (
          <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50/80 text-emerald-800 text-[0.65rem] font-mono font-normal dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
            Username: {note.credentialData.username}
          </div>
        )}
      </div>

      {/* Footer Meta: Tags & Date */}
      <div className="pt-2 mt-1 border-t border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between text-[0.68rem] text-zinc-400">
        <div className="flex items-center gap-1 flex-wrap">
          {note.tags.slice(0, 2).map(tag => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded-full bg-zinc-100/70 text-zinc-500 dark:bg-zinc-800/70 dark:text-zinc-400 font-medium tracking-tight text-[0.62rem]"
            >
              #{tag}
            </span>
          ))}
          {note.tags.length > 2 && (
            <span className="text-zinc-400 font-medium text-[0.62rem]">+{note.tags.length - 2}</span>
          )}
        </div>

        <span className="flex items-center gap-1 text-[0.65rem] font-medium shrink-0">
          <Clock className="size-2.5 text-zinc-400" /> {formattedDate}
        </span>
      </div>
    </Card>
  )
}
