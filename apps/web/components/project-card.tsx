'use client'

import React from 'react'
import { FolderOpen, Layers, ArrowUpRight } from 'lucide-react'
import { NoteType } from '@/lib/types/note'
import { NoteTypeIcon } from '@/components/note-type-icon'
import { cn } from '@workspace/ui/lib/utils'

interface ProjectCardProps {
  name: string
  count: number
  types: NoteType[]
  isSelected: boolean
  onClick: () => void
}

export function ProjectCard({
  name,
  count,
  types,
  isSelected,
  onClick
}: ProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none min-w-[210px] shrink-0",
        isSelected
          ? "bg-zinc-900 text-white border-zinc-900 shadow-md dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
          : "bg-white/90 border-zinc-200/80 hover:border-zinc-300 dark:bg-zinc-900/90 dark:border-zinc-800 dark:hover:border-zinc-700"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {/* Container around icon: less rounded (rounded-md/rounded-lg) */}
          <div
            className={cn(
              "p-2 rounded-md flex items-center justify-center transition-colors",
              isSelected
                ? "bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                : "bg-zinc-200/90 text-zinc-800 dark:bg-zinc-700/80 dark:text-zinc-200"
            )}
          >
            <FolderOpen className="size-4" strokeWidth={2.75} />
          </div>
          <div className="flex flex-col">
            <span
              className={cn(
                "text-[0.88rem] font-semibold tracking-tight line-clamp-1",
                isSelected ? "text-white dark:text-zinc-900" : "text-zinc-900/90 dark:text-zinc-100"
              )}
            >
              {name}
            </span>
            <span
              className={cn(
                "text-[0.65rem] font-medium tracking-tight",
                isSelected ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400"
              )}
            >
              {count} {count === 1 ? 'note' : 'notes'}
            </span>
          </div>
        </div>

        <ArrowUpRight
          strokeWidth={2.75}
          className={cn(
            "size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
            isSelected ? "text-white dark:text-zinc-900" : "text-zinc-400 opacity-0 group-hover:opacity-100"
          )}
        />
      </div>

      {/* Note Type Badges */}
      <div className="flex items-center gap-1 mt-1 overflow-hidden">
        {types.slice(0, 4).map(t => (
          <NoteTypeIcon key={t} type={t} size="sm" />
        ))}
        {types.length > 4 && (
          <span
            className={cn(
              "text-[0.62rem] font-medium px-1.5 py-0.5 rounded-md",
              isSelected ? "bg-zinc-800 text-zinc-300 dark:bg-zinc-200 dark:text-zinc-700" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
            )}
          >
            +{types.length - 4}
          </span>
        )}
      </div>
    </div>
  )
}
