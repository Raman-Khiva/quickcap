'use client'

import React from 'react'
import { Search, SlidersHorizontal, X, Sparkles, Command } from 'lucide-react'
import { SearchFilter } from '@/lib/types/note'
import { Input } from '@workspace/ui/components/input'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'

interface RapidRetrievalBarProps {
  filter: SearchFilter
  setFilter: React.Dispatch<React.SetStateAction<SearchFilter>>
  onOpenRetrievalModal: () => void
  onOpenQuickCap: () => void
  totalCount: number
  filteredCount: number
}

export function RapidRetrievalBar({
  filter,
  setFilter,
  onOpenRetrievalModal,
  onOpenQuickCap,
  totalCount,
  filteredCount
}: RapidRetrievalBarProps) {
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, query: e.target.value }))
  }

  const clearQuery = () => {
    setFilter(prev => ({ ...prev, query: '' }))
  }

  return (
    <div className="flex flex-col gap-3 w-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 p-4 rounded-2xl shadow-xs">
      <div className="flex items-center gap-3 w-full">
        {/* Rapid Search Input */}
        <div className="relative flex-1">
          <Input
            value={filter.query}
            onChange={handleQueryChange}
            placeholder="Rapid retrieval search notes, tags, or contents... (Press '/')"
            icon={<Search className="size-4 text-zinc-400" />}
            className="pr-20 text-sm font-normal bg-zinc-100/70 border-0 rounded-xl"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {filter.query ? (
              <button
                onClick={clearQuery}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[0.65rem] font-mono rounded-full bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Global Search Palette Button */}
        <Button
          variant="pillOutline"
          size="default"
          onClick={onOpenRetrievalModal}
          className="shrink-0 gap-2 text-xs font-medium"
        >
          <Command className="size-3.5 text-zinc-500" />
          <span className="hidden md:inline">Command Palette</span>
          <kbd className="px-1.5 py-0.5 text-[0.65rem] font-mono rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            ⌘K
          </kbd>
        </Button>

        {/* Quick Capture Button */}
        <Button
          variant="pill"
          size="default"
          onClick={onOpenQuickCap}
          className="shrink-0 gap-2 text-xs font-medium"
        >
          <Sparkles className="size-3.5 text-amber-300" />
          <span className="hidden sm:inline">Quick Capture</span>
        </Button>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto py-0.5 no-scrollbar">
          <span className="text-zinc-400 flex items-center gap-1 shrink-0 font-medium">
            <SlidersHorizontal className="size-3" /> Filter:
          </span>

          <button
            onClick={() => setFilter(prev => ({ ...prev, status: prev.status === 'pending' ? 'all' : 'pending' }))}
            className="cursor-pointer shrink-0"
          >
            <Badge
              variant={filter.status === 'pending' ? 'amber' : 'outline'}
              size="sm"
              dotColor="amber"
            >
              Pending
            </Badge>
          </button>

          <button
            onClick={() => setFilter(prev => ({ ...prev, status: prev.status === 'active' ? 'all' : 'active' }))}
            className="cursor-pointer shrink-0"
          >
            <Badge
              variant={filter.status === 'active' ? 'emerald' : 'outline'}
              size="sm"
              dotColor="emerald"
            >
              Active
            </Badge>
          </button>

          <button
            onClick={() => setFilter(prev => ({ ...prev, onlyPinned: !prev.onlyPinned }))}
            className="cursor-pointer shrink-0"
          >
            <Badge
              variant={filter.onlyPinned ? 'indigo' : 'outline'}
              size="sm"
              dotColor="indigo"
            >
              Pinned
            </Badge>
          </button>

          <button
            onClick={() => setFilter(prev => ({ ...prev, onlyFavorites: !prev.onlyFavorites }))}
            className="cursor-pointer shrink-0"
          >
            <Badge
              variant={filter.onlyFavorites ? 'default' : 'outline'}
              size="sm"
            >
              ★ Favorites
            </Badge>
          </button>

          {filter.selectedTag && (
            <button
              onClick={() => setFilter(prev => ({ ...prev, selectedTag: null }))}
              className="cursor-pointer shrink-0"
            >
              <Badge variant="default" size="sm">
                #{filter.selectedTag} ✕
              </Badge>
            </button>
          )}
        </div>

        <div className="text-[0.75rem] text-zinc-400 shrink-0 font-medium">
          Showing <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{filteredCount}</span> of {totalCount} notes
        </div>
      </div>
    </div>
  )
}
