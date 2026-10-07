'use client'

import React from 'react'
import {
  FileText,
  Wallet,
  BarChart3,
  Target,
  BookOpen,
  CreditCard,
  Zap,
  Star,
  Tag,
  Plus,
  Clock,
  Activity,
  CheckCircle2,
  Pin,
  SlidersHorizontal,
  FolderOpen,
  Layers
} from 'lucide-react'
import { NoteCategory, NoteType, SearchFilter } from '@/lib/types/note'
import { Button } from '@workspace/ui/components/button'
import { NoteTypeIcon } from '@/components/note-type-icon'
import { cn } from '@workspace/ui/lib/utils'

interface SidebarNavProps {
  filter: SearchFilter
  setFilter: React.Dispatch<React.SetStateAction<SearchFilter>>
  onOpenQuickCap: () => void
  totalNotes: number
  allTags: string[]
  allProjects: string[]
}

export function SidebarNav({
  filter,
  setFilter,
  onOpenQuickCap,
  totalNotes,
  allTags,
  allProjects
}: SidebarNavProps) {
  const handleCategorySelect = (cat: NoteCategory | 'all') => {
    setFilter(prev => ({
      ...prev,
      category: cat,
      selectedTag: null
    }))
  }

  const handleTypeSelect = (type: NoteType | 'all') => {
    setFilter(prev => ({
      ...prev,
      selectedType: prev.selectedType === type ? 'all' : type
    }))
  }

  const handleProjectSelect = (proj: string | null) => {
    setFilter(prev => ({
      ...prev,
      selectedProject: prev.selectedProject === proj ? null : proj
    }))
  }

  const handleTagSelect = (tag: string | null) => {
    setFilter(prev => ({
      ...prev,
      selectedTag: prev.selectedTag === tag ? null : tag
    }))
  }

  return (
    <aside className="w-full shrink-0 flex flex-col gap-4 select-none">
      {/* Brand & Quick Capture Trigger */}
      <div className="flex flex-col gap-2.5 px-1">
        <div className="flex items-center gap-2 px-1">
          <div className="size-7 rounded-full bg-zinc-900 text-white flex items-center justify-center font-semibold text-xs shadow-2xs dark:bg-zinc-100 dark:text-zinc-900">
            <Zap className="size-3.5 fill-white dark:fill-zinc-900" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-zinc-900/90 dark:text-zinc-100 leading-none">
              QuickCap
            </span>
            <span className="text-[0.62rem] text-zinc-400 font-medium tracking-wider uppercase mt-0.5">
              Rapid Notetaking Hub
            </span>
          </div>
        </div>

        <Button
          onClick={onOpenQuickCap}
          className="w-full justify-between shadow-2xs mt-0.5 text-xs font-medium tracking-tight h-8"
          size="sm"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Plus className="size-3.5" /> Quick Capture
          </span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[0.6rem] font-mono font-normal rounded-full bg-zinc-800 text-zinc-300 dark:bg-zinc-200 dark:text-zinc-700">
            ⌘J
          </kbd>
        </Button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-1 pr-1 custom-scrollbar">
        {/* Navigation Section: Overview */}
        <div className="space-y-0.5">
          <div className="px-2 text-[0.62rem] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
            Overview
          </div>
          <NavItem
            icon={<Zap className="size-3.5" />}
            label="All Notes"
            badge={totalNotes}
            active={
              filter.category === 'all' &&
              filter.selectedType === 'all' &&
              filter.selectedProject === null &&
              filter.status === 'all' &&
              !filter.onlyFavorites &&
              !filter.onlyPinned &&
              !filter.selectedTag
            }
            onClick={() => {
              setFilter({
                query: filter.query,
                category: 'all',
                selectedType: 'all',
                selectedProject: null,
                selectedTag: null,
                status: 'all',
                onlyPinned: false,
                onlyFavorites: false
              })
            }}
          />
          <NavItem
            icon={<Star className="size-3.5 text-amber-500" />}
            label="Starred Notes"
            active={filter.onlyFavorites}
            onClick={() => {
              setFilter(prev => ({
                ...prev,
                onlyFavorites: !prev.onlyFavorites
              }))
            }}
          />
          <NavItem
            icon={<Pin className="size-3.5 text-indigo-500" />}
            label="Pinned Notes"
            active={filter.onlyPinned}
            onClick={() => {
              setFilter(prev => ({
                ...prev,
                onlyPinned: !prev.onlyPinned
              }))
            }}
          />
        </div>

        {/* NOTE TYPES FILTER SECTION */}
        <div className="space-y-0.5">
          <div className="px-2 text-[0.62rem] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Note Types</span>
            <Layers className="size-3 text-zinc-400" />
          </div>
          <NavItem
            icon={<NoteTypeIcon type="credential" size="sm" />}
            label="Credentials & Keys"
            active={filter.selectedType === 'credential'}
            onClick={() => handleTypeSelect('credential')}
          />
          <NavItem
            icon={<NoteTypeIcon type="code" size="sm" />}
            label="Code Snippets"
            active={filter.selectedType === 'code'}
            onClick={() => handleTypeSelect('code')}
          />
          <NavItem
            icon={<NoteTypeIcon type="finance" size="sm" />}
            label="Finance & Payouts"
            active={filter.selectedType === 'finance'}
            onClick={() => handleTypeSelect('finance')}
          />
          <NavItem
            icon={<NoteTypeIcon type="meeting" size="sm" />}
            label="Meeting Notes"
            active={filter.selectedType === 'meeting'}
            onClick={() => handleTypeSelect('meeting')}
          />
          <NavItem
            icon={<NoteTypeIcon type="checklist" size="sm" />}
            label="Checklists"
            active={filter.selectedType === 'checklist'}
            onClick={() => handleTypeSelect('checklist')}
          />
          <NavItem
            icon={<NoteTypeIcon type="voice" size="sm" />}
            label="Voice Memos"
            active={filter.selectedType === 'voice'}
            onClick={() => handleTypeSelect('voice')}
          />
        </div>

        {/* PROJECTS FILTER SECTION */}
        {allProjects.length > 0 && (
          <div className="space-y-0.5">
            <div className="px-2 text-[0.62rem] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1 flex items-center justify-between">
              <span>Projects</span>
              <FolderOpen className="size-3 text-zinc-400" />
            </div>
            {allProjects.map(proj => (
              <NavItem
                key={proj}
                icon={<FolderOpen className="size-3 text-zinc-400" />}
                label={proj}
                active={filter.selectedProject === proj}
                onClick={() => handleProjectSelect(proj)}
              />
            ))}
          </div>
        )}

        {/* Status Filters Section */}
        <div className="space-y-0.5">
          <div className="px-2 text-[0.62rem] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1 flex items-center justify-between">
            <span>Status</span>
            <SlidersHorizontal className="size-3 text-zinc-400" />
          </div>
          <NavItem
            icon={<Clock className="size-3.5 text-amber-500" />}
            label="Pending Setup"
            active={filter.status === 'pending'}
            onClick={() => setFilter(prev => ({ ...prev, status: prev.status === 'pending' ? 'all' : 'pending' }))}
          />
          <NavItem
            icon={<Activity className="size-3.5 text-emerald-500" />}
            label="Active Notes"
            active={filter.status === 'active'}
            onClick={() => setFilter(prev => ({ ...prev, status: prev.status === 'active' ? 'all' : 'active' }))}
          />
          <NavItem
            icon={<CheckCircle2 className="size-3.5 text-indigo-500" />}
            label="Completed"
            active={filter.status === 'completed'}
            onClick={() => setFilter(prev => ({ ...prev, status: prev.status === 'completed' ? 'all' : 'completed' }))}
          />
        </div>

        {/* Navigation Section: Planning */}
        <div className="space-y-0.5">
          <div className="px-2 text-[0.62rem] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1">
            Categories
          </div>
          <NavItem
            icon={<FileText className="size-3.5" />}
            label="Documents"
            active={filter.category === 'planning'}
            onClick={() => handleCategorySelect('planning')}
          />
          <NavItem
            icon={<Wallet className="size-3.5" />}
            label="Budget & Savings"
            onClick={() => handleCategorySelect('planning')}
          />
          <NavItem
            icon={<BarChart3 className="size-3.5" />}
            label="Reports"
            onClick={() => handleCategorySelect('planning')}
          />
          <NavItem
            icon={<Target className="size-3.5" />}
            label="Goals"
            onClick={() => handleCategorySelect('planning')}
          />
        </div>

        {/* Tags Section */}
        {allTags.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
            <div className="px-2 text-[0.62rem] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest flex items-center justify-between">
              <span>Tags</span>
              <Tag className="size-3 text-zinc-400" />
            </div>
            <div className="flex flex-wrap gap-1 px-1">
              {allTags.map(tag => {
                const isSelected = filter.selectedTag === tag
                return (
                  <button
                    key={tag}
                    onClick={() => handleTagSelect(tag)}
                    className={cn(
                      "text-[0.68rem] px-2 py-0.5 rounded-full border transition-all cursor-pointer font-medium tracking-tight",
                      isSelected
                        ? "bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                        : "bg-white text-zinc-600 border-zinc-200/70 hover:bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
                    )}
                  >
                    #{tag}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  badge?: number | string
  onClick?: () => void
}

function NavItem({ icon, label, active, badge, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-2 py-1.5 rounded-xl text-[0.8rem] font-medium tracking-tight transition-all duration-150 cursor-pointer group",
        active
          ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
          : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100"
      )}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={cn(
            "transition-colors shrink-0 flex items-center justify-center",
            active
              ? "text-white dark:text-zinc-900"
              : "text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100"
          )}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </div>
      {badge !== undefined && (
        <span
          className={cn(
            "text-[0.62rem] px-1.5 py-0.5 rounded-full font-medium shrink-0 tracking-tight",
            active
              ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
