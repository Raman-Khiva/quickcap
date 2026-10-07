'use client'

import React, { useState, useMemo } from 'react'
import { useQuickCapStore } from '@/hooks/use-quickcap-store'
import { SidebarNav } from '@/components/sidebar-nav'
import { NoteCard } from '@/components/note-card'
import { ProjectCard } from '@/components/project-card'
import { SuggestionCard, getSuggestionReason } from '@/components/suggestion-card'
import { NoteEditorModal } from '@/components/note-editor-modal'
import { QuickCaptureModal } from '@/components/quick-capture-modal'
import { RapidRetrievalModal } from '@/components/rapid-retrieval-modal'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { RefreshCw, Search, Command, X, Plus, FolderOpen, Layers, Clock, Sparkles } from 'lucide-react'

export default function Page() {
  const {
    notes,
    filteredNotes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    allTags,
    allProjects,
    topProjects,
    filter,
    setFilter,
    captureNote,
    updateNote,
    deleteNote,
    togglePin,
    toggleFavorite,
    isCaptureModalOpen,
    setIsCaptureModalOpen,
    isRetrievalModalOpen,
    setIsRetrievalModalOpen,
    resetNotes
  } = useQuickCapStore()

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // Smart suggestions for the 4th column ("It Took a Look")
  const suggestedItems = useMemo(() => {
    return filteredNotes
      .filter(n =>
        n.type === 'credential' ||
        n.type === 'finance' ||
        n.isPinned ||
        (n.title + ' ' + n.content + ' ' + n.tags.join(' ')).toLowerCase().includes('ui') ||
        (n.title + ' ' + n.content + ' ' + n.tags.join(' ')).toLowerCase().includes('library') ||
        (n.title + ' ' + n.content + ' ' + n.tags.join(' ')).toLowerCase().includes('http')
      )
      .slice(0, 4)
      .map(n => ({
        note: n,
        suggestion: getSuggestionReason(n)
      }))
  }, [filteredNotes])

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, query: e.target.value }))
  }

  const clearQuery = () => {
    setFilter(prev => ({ ...prev, query: '' }))
  }

  const resetAllFilters = () => {
    setFilter({
      query: '',
      category: 'all',
      selectedType: 'all',
      selectedProject: null,
      selectedTag: null,
      status: 'all',
      onlyPinned: false,
      onlyFavorites: false
    })
  }

  const handleProjectSelect = (projectName: string) => {
    setFilter(prev => ({
      ...prev,
      selectedProject: prev.selectedProject === projectName ? null : projectName
    }))
  }

  const handleSelectNote = (noteId: string) => {
    setActiveNoteId(noteId)
    setIsDetailModalOpen(true)
  }

  return (
    <div className="h-screen w-screen bg-[#f5f5f5] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans antialiased selection:bg-zinc-900 selection:text-white overflow-hidden">
      {/* Top Banner Bar */}
      <header className="h-14 border-b border-zinc-200/70 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shrink-0 z-40 flex items-center justify-between px-5 w-full gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Workspace
          </span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            QuickCap
          </span>
        </div>

        {/* Center: Search & Command Palette */}
        <div className="flex-1 max-w-2xl flex items-center gap-2 mx-auto">
          <div className="relative flex-1">
            <Input
              value={filter.query}
              onChange={handleQueryChange}
              placeholder="Search notes, credentials, tags, or projects... (Press '/')"
              icon={<Search className="size-3.5 text-zinc-400" />}
              className="pr-16 text-xs h-9 bg-zinc-100/70 border-0 rounded-xl dark:bg-zinc-800/70"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {filter.query ? (
                <button
                  onClick={clearQuery}
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[0.6rem] font-mono rounded-full bg-zinc-200/80 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  /
                </kbd>
              )}
            </div>
          </div>

          <Button
            variant="pillOutline"
            size="xs"
            onClick={() => setIsRetrievalModalOpen(true)}
            className="shrink-0 gap-1.5 text-xs h-9 px-3"
          >
            <Command className="size-3.5 text-zinc-500" />
            <span className="hidden md:inline font-medium">Spotlight</span>
            <kbd className="px-1.5 py-0.5 text-[0.6rem] font-mono rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              ⌘K
            </kbd>
          </Button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="xs"
            onClick={resetNotes}
            className="text-zinc-500 hover:text-zinc-800 gap-1 text-[0.75rem]"
            title="Reset to default sample data"
          >
            <RefreshCw className="size-3" /> Reset Seed Data
          </Button>

          <Button
            variant="pill"
            size="xs"
            onClick={() => setIsCaptureModalOpen(true)}
            className="text-xs px-3.5 h-8 gap-1"
          >
            <Plus className="size-3.5" /> Quick Capture
          </Button>
        </div>
      </header>

      {/* Main Full-Height Workspace Layout */}
      <div className="flex-1 flex w-full h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Left Fixed Sidebar Container */}
        <div className="w-64 h-full border-r border-zinc-200/80 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60 p-4 shrink-0 flex flex-col overflow-y-auto custom-scrollbar">
          <SidebarNav
            filter={filter}
            setFilter={setFilter}
            onOpenQuickCap={() => setIsCaptureModalOpen(true)}
            totalNotes={notes.length}
            allTags={allTags}
            allProjects={allProjects}
          />
        </div>

        {/* Right Full-Width Main Viewport */}
        <main className="flex-1 h-full p-5 overflow-hidden min-w-0 flex flex-col gap-5 w-full">
          
          {/* TOP PORTION: Top Projects (Full Width Floating Cards) */}
          <div className="shrink-0 flex flex-col gap-2.5 w-full">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2 text-[0.92rem] font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
                <FolderOpen className="size-4 text-zinc-500 dark:text-zinc-400" strokeWidth={2.25} />
                <span>Top Projects</span>
                <span className="text-xs font-normal text-zinc-400">({topProjects.length})</span>
              </div>

              {filter.selectedProject && (
                <button
                  onClick={() => setFilter(prev => ({ ...prev, selectedProject: null }))}
                  className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline cursor-pointer flex items-center gap-1"
                >
                  Show All Projects ✕
                </button>
              )}
            </div>

            {/* Horizontal Project Cards Stream starting from left */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 custom-scrollbar w-full">
              {topProjects.map(proj => (
                <ProjectCard
                  key={proj.name}
                  name={proj.name}
                  count={proj.count}
                  types={proj.types}
                  isSelected={filter.selectedProject === proj.name}
                  onClick={() => handleProjectSelect(proj.name)}
                />
              ))}
            </div>
          </div>

          {/* BOTTOM PORTION: Split into Left (3 Columns: Recent Activity) & 4th Column ('It Took a Look') */}
          <div className="flex-1 min-h-0 overflow-hidden w-full">
            {filteredNotes.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 space-y-3 max-w-md">
                <div className="text-zinc-400 text-xs font-medium">
                  No notes match the current search or project filter.
                </div>
                <Button
                  variant="pillSecondary"
                  size="xs"
                  onClick={resetAllFilters}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 h-full w-full overflow-hidden">
                
                {/* LEFT SECTION (3 COLUMNS): Recent Activity */}
                <div className="lg:col-span-3 flex flex-col gap-2.5 h-full min-h-0 overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-zinc-400 px-1 shrink-0">
                    <span className="flex items-center gap-2 text-[0.92rem] font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
                      <Clock className="size-4 text-zinc-500 dark:text-zinc-400" strokeWidth={2.25} />
                      Recent Activity
                      <span className="text-xs font-normal text-zinc-400">({filteredNotes.length})</span>
                    </span>

                    {(filter.query || filter.selectedTag || filter.selectedProject || filter.selectedType !== 'all' || filter.category !== 'all' || filter.status !== 'all' || filter.onlyPinned || filter.onlyFavorites) && (
                      <button
                        onClick={resetAllFilters}
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-medium"
                      >
                        Clear Filters ✕
                      </button>
                    )}
                  </div>

                  {/* 3-Column Grid of Recent Notes */}
                  <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pb-4">
                      {filteredNotes.map(note => (
                        <NoteCard
                          key={note.id}
                          note={note}
                          isActive={note.id === activeNoteId}
                          onSelect={() => handleSelectNote(note.id)}
                          onTogglePin={() => togglePin(note.id)}
                          onToggleFavorite={() => toggleFavorite(note.id)}
                          onDelete={() => deleteNote(note.id)}
                          defaultShowPreview={true}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT 4TH COLUMN (1 COLUMN): "It Took a Look" / Suggestions */}
                <div className="lg:col-span-1 flex flex-col gap-2.5 h-full min-h-0 overflow-hidden border-l border-zinc-200/60 dark:border-zinc-800/60 pl-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 px-1 shrink-0">
                    <span className="flex items-center gap-2 text-[0.92rem] font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">
                      <Sparkles className="size-4 text-amber-500 shrink-0" strokeWidth={2.25} />
                      <span>It Took a Look</span>
                      <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-medium tracking-tight">
                        Suggestions
                      </span>
                    </span>
                  </div>

                  {/* 1-Column Stream of Smart Suggestions */}
                  <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar flex flex-col gap-3.5 pb-4">
                    {suggestedItems.map(item => (
                      <SuggestionCard
                        key={item.note.id}
                        note={item.note}
                        suggestion={item.suggestion}
                        isActive={item.note.id === activeNoteId}
                        onSelect={() => handleSelectNote(item.note.id)}
                        onTogglePin={() => togglePin(item.note.id)}
                        onToggleFavorite={() => toggleFavorite(item.note.id)}
                        onDelete={() => deleteNote(item.note.id)}
                      />
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </main>
      </div>

      {/* Details Section (On-Demand Modal when clicking a note card) */}
      <NoteEditorModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        note={activeNote}
        onUpdate={updateNote}
        onDelete={deleteNote}
        onTogglePin={togglePin}
        onToggleFavorite={toggleFavorite}
        onOpenQuickCap={() => setIsCaptureModalOpen(true)}
      />

      {/* Modals & Dialogs */}
      <QuickCaptureModal
        isOpen={isCaptureModalOpen}
        onClose={() => setIsCaptureModalOpen(false)}
        onCapture={captureNote}
      />

      <RapidRetrievalModal
        isOpen={isRetrievalModalOpen}
        onClose={() => setIsRetrievalModalOpen(false)}
        notes={notes}
        onSelectNote={id => handleSelectNote(id)}
      />
    </div>
  )
}
