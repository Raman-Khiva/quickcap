'use client'

import React, { useState, useEffect } from 'react'
import { Command, ArrowRight, X, Pin, Star, Folder } from 'lucide-react'
import { Note } from '@/lib/types/note'
import { Card, CardHeader, CardContent } from '@workspace/ui/components/card'
import { Input } from '@workspace/ui/components/input'
import { NoteTypeIcon } from '@/components/note-type-icon'
import { cn } from '@workspace/ui/lib/utils'

interface RapidRetrievalModalProps {
  isOpen: boolean
  onClose: () => void
  notes: Note[]
  onSelectNote: (noteId: string) => void
}

export function RapidRetrievalModal({
  isOpen,
  onClose,
  notes,
  onSelectNote
}: RapidRetrievalModalProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Filter notes
  const results = notes.filter(n => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some(t => t.toLowerCase().includes(q)) ||
      n.category.toLowerCase().includes(q) ||
      n.projectName?.toLowerCase().includes(q) ||
      n.credentialData?.username?.toLowerCase().includes(q)
    )
  }).slice(0, 8)

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) {
          onSelectNote(results[selectedIndex].id)
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onSelectNote, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header / Input */}
        <CardHeader className="p-4 pb-3 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center gap-3">
          <Command className="size-5 text-zinc-400 shrink-0" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search all captured notes, credentials & projects..."
            className="border-0 bg-transparent text-base font-medium focus:ring-0 focus:border-0 focus:bg-transparent px-0 h-10"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </CardHeader>

        {/* Results Stream */}
        <CardContent className="p-2 max-h-[420px] overflow-y-auto custom-scrollbar space-y-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No matching notes found for &quot;<span className="font-semibold text-zinc-600 dark:text-zinc-300">{query}</span>&quot;
            </div>
          ) : (
            results.map((note, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note.id)
                    onClose()
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4",
                    isSelected
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                      : "hover:bg-zinc-100/80 text-zinc-800 dark:hover:bg-zinc-800/80 dark:text-zinc-200"
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <NoteTypeIcon type={note.type || 'note'} size="md" className="mt-0.5" />

                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{note.title}</span>
                        {note.projectName && (
                          <span
                            className={cn(
                              "text-[0.65rem] px-2 py-0.5 rounded-full font-medium flex items-center gap-1",
                              isSelected
                                ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800"
                                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                            )}
                          >
                            <Folder className="size-2.5 opacity-70" />
                            {note.projectName}
                          </span>
                        )}
                        {note.isPinned && (
                          <Pin className="size-3 text-indigo-400 shrink-0" />
                        )}
                        {note.isFavorite && (
                          <Star className="size-3 text-amber-400 fill-amber-400 shrink-0" />
                        )}
                      </div>

                      <p
                        className={cn(
                          "text-xs line-clamp-1 font-mono",
                          isSelected ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400"
                        )}
                      >
                        {note.credentialData?.username
                          ? `Username: ${note.credentialData.username} — ${note.content}`
                          : note.content}
                      </p>

                      <div className="flex items-center gap-2 mt-0.5 text-[0.7rem]">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full font-medium uppercase tracking-wider text-[0.65rem]",
                            isSelected
                              ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-200 dark:text-zinc-800"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                          )}
                        >
                          {note.category}
                        </span>

                        {note.tags.map(t => (
                          <span
                            key={t}
                            className={cn(
                              "opacity-80",
                              isSelected ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-400"
                            )}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className={cn(
                      "size-4 shrink-0 transition-transform",
                      isSelected ? "translate-x-1 opacity-100" : "opacity-0"
                    )}
                  />
                </div>
              )
            })
          )}
        </CardContent>

        {/* Navigation Footer */}
        <div className="p-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-mono text-[0.65rem]">
                ↑↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-mono text-[0.65rem]">
                ↵
              </kbd>{" "}
              Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 font-mono text-[0.65rem]">
                ESC
              </kbd>{" "}
              Close
            </span>
          </div>

          <div className="text-[0.7rem] font-medium">Spotlight Search</div>
        </div>
      </Card>
    </div>
  )
}
