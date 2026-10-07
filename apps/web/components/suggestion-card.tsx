'use client'

import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import { Note } from '@/lib/types/note'
import { NoteCard } from '@/components/note-card'
import { cn } from '@workspace/ui/lib/utils'

interface SuggestionCardProps {
  note: Note
  suggestion: string
  isActive: boolean
  onSelect: () => void
  onTogglePin: () => void
  onToggleFavorite: () => void
  onDelete: () => void
}

export function SuggestionCard({
  note,
  suggestion,
  isActive,
  onSelect,
  onTogglePin,
  onToggleFavorite,
  onDelete
}: SuggestionCardProps) {
  const getPillStyle = () => {
    const contentLower = (note.title + ' ' + note.content).toLowerCase()
    if (contentLower.includes('ui library') || contentLower.includes('shadcn') || contentLower.includes('http')) {
      return {
        container: "bg-indigo-50/90 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border-indigo-200/80 dark:border-indigo-800/80 hover:bg-indigo-100/80",
        icon: "text-indigo-600 dark:text-indigo-400"
      }
    }
    if (note.type === 'credential') {
      return {
        container: "bg-emerald-50/90 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80 hover:bg-emerald-100/80",
        icon: "text-emerald-600 dark:text-emerald-400"
      }
    }
    if (note.type === 'finance') {
      return {
        container: "bg-amber-50/90 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/80 hover:bg-amber-100/80",
        icon: "text-amber-600 dark:text-amber-400"
      }
    }
    return {
      container: "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent hover:bg-zinc-800 dark:hover:bg-zinc-200",
      icon: "text-amber-400 dark:text-amber-600"
    }
  }

  const pillStyle = getPillStyle()

  return (
    <div className="flex flex-col gap-1.5 group/sug">
      {/* Contextual Message Bubble / Pill */}
      <div
        onClick={onSelect}
        className={cn(
          "cursor-pointer flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-lg border text-[0.7rem] font-semibold tracking-tight transition-all duration-200 shadow-2xs select-none",
          pillStyle.container
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className={cn("size-3 shrink-0", pillStyle.icon)} strokeWidth={2.75} />
          <span className="truncate">{suggestion}</span>
        </div>
        <ArrowRight className="size-3 shrink-0 opacity-70 group-hover/sug:translate-x-0.5 transition-transform" strokeWidth={2.75} />
      </div>

      {/* Note Card */}
      <NoteCard
        note={note}
        isActive={isActive}
        onSelect={onSelect}
        onTogglePin={onTogglePin}
        onToggleFavorite={onToggleFavorite}
        onDelete={onDelete}
        defaultShowPreview={true}
      />
    </div>
  )
}

export function getSuggestionReason(note: Note): string {
  const contentLower = (note.title + ' ' + note.content + ' ' + note.tags.join(' ')).toLowerCase()

  if (contentLower.includes('ui library') || contentLower.includes('shadcn') || contentLower.includes('component library') || contentLower.includes('lucide') || contentLower.includes('tailwind') || contentLower.includes('http')) {
    return 'Check this UI library'
  }
  if (note.type === 'credential' || note.credentialData) {
    return 'You may need this credential'
  }
  if (note.type === 'finance' || contentLower.includes('payout') || contentLower.includes('balance')) {
    return 'Review payout & claim status'
  }
  if (note.type === 'code' || contentLower.includes('api') || contentLower.includes('token')) {
    return 'Quick code & key snippet'
  }
  if (note.type === 'meeting') {
    return 'Key sync & team decisions'
  }
  if (note.isPinned) {
    return 'High-priority pinned note'
  }
  if (note.isFavorite) {
    return 'Starred favorite quick-access'
  }
  return 'You may need to review this'
}
