'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Note, NoteCategory, NoteType, QuickCaptureInput, SearchFilter } from '@/lib/types/note'

const STORAGE_KEY = 'quickcap_notes_v2'

const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Stellar API Production Bearer Token & Keys',
    content: 'Production API access tokens for high-frequency search and vector retrieval endpoint.',
    category: 'account',
    type: 'credential',
    projectName: 'Stellar API',
    credentialData: {
      username: 'api-service-prod@quickcap.io',
      secret: 'sk_live_98a72b14f89100234ac9e81',
      url: 'https://api.quickcap.io/v1/auth'
    },
    tags: ['api-key', 'credentials', 'security'],
    status: 'active',
    priority: 'high',
    isPinned: true,
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    metadata: { author: 'Raman', wordCount: 14 }
  },
  {
    id: 'note-2',
    title: 'Claimable Balance Setup & Payout Threshold',
    content: 'Set the minimum balance requirement before a payout is triggered. Once your bank is connected, balances over $10.00 are automatically eligible for monthly distribution on the 15th of each month.\n\n- Net Royalties: $1,248.75\n- Processing Fee: -$37.46\n- Total Ready to Claim: $1,211.29 USD',
    category: 'account',
    type: 'finance',
    projectName: 'Financial Vault',
    tags: ['billing', 'finance', 'payout'],
    status: 'pending',
    priority: 'high',
    isPinned: true,
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    metadata: { author: 'Raman', wordCount: 45 }
  },
  {
    id: 'note-3',
    title: 'Instant Search Index & Client Cache Engine',
    content: `export function filterNotes(notes: Note[], query: string) {
  const q = query.toLowerCase().trim()
  if (!q) return notes
  return notes.filter(n =>
    n.title.toLowerCase().includes(q) ||
    n.content.toLowerCase().includes(q) ||
    n.tags.some(t => t.toLowerCase().includes(q))
  )
}`,
    category: 'scratchpad',
    type: 'code',
    projectName: 'Project QuickCap',
    tags: ['design', 'architecture', 'typescript'],
    status: 'active',
    priority: 'high',
    isPinned: false,
    isFavorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    metadata: { codeSnippetLanguage: 'typescript', wordCount: 38 }
  },
  {
    id: 'note-4',
    title: 'Architecture Review & Sprint Sync',
    content: 'Attendees:\n- Raman (Lead)\n- DeepMind Pair Team\n\nKey Decisions:\n1. Use solid color box containers for Note Type icons.\n2. Add rapid copy actions for credential notes.\n3. Keep layout 100% full height and width.',
    category: 'planning',
    type: 'meeting',
    projectName: 'Project QuickCap',
    tags: ['meeting', 'sync', 'sprint'],
    status: 'active',
    priority: 'medium',
    isPinned: false,
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    metadata: { wordCount: 42 }
  },
  {
    id: 'note-5',
    title: 'UX Design System Corner Radius Audit',
    content: '- [x] Adjust card corners to rounded-2xl\n- [x] Adjust input boxes to rounded-xl\n- [x] Pin fixed sidebar container to screen left\n- [ ] Integrate project filter badges',
    category: 'planning',
    type: 'checklist',
    projectName: 'Design System',
    tags: ['tasks', 'checklist', 'ui'],
    status: 'active',
    priority: 'medium',
    isPinned: false,
    isFavorite: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    metadata: { wordCount: 28 }
  },
  {
    id: 'note-6',
    title: 'Voice Memorandum: Premium Icon Shade Aesthetic',
    content: 'Captured audio memorandum (0:42):\n"Give each icon a vibrant accent color and create a solid box with a lighter shade of that same color around it for instant visual type identification."',
    category: 'ideas',
    type: 'voice',
    projectName: 'Design System',
    tags: ['voice-memo', 'ux', 'feedback'],
    status: 'completed',
    priority: 'low',
    isPinned: false,
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    metadata: { audioMemoLength: '0:42', wordCount: 30 }
  },
  {
    id: 'note-7',
    title: 'Modern UI Component Library & Icons Reference',
    content: 'Awesome UI library resources for QuickCap redesign:\n- Tailwind v4 components: https://ui.shadcn.com\n- Lucide Icon Set: https://lucide.dev\n- Glassmorphism & Micro-animations UI kit.',
    category: 'scratchpad',
    type: 'note',
    projectName: 'Design System',
    tags: ['ui', 'library', 'components', 'resources'],
    status: 'active',
    priority: 'high',
    isPinned: true,
    isFavorite: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    metadata: { wordCount: 25 }
  }
]

export function useQuickCapStore() {
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false)
  const [isRetrievalModalOpen, setIsRetrievalModalOpen] = useState(false)

  const [filter, setFilter] = useState<SearchFilter>({
    query: '',
    category: 'all',
    selectedType: 'all',
    selectedProject: null,
    selectedTag: null,
    status: 'all',
    onlyPinned: false,
    onlyFavorites: false,
  })

  // Load from localStorage or seed
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed)
          setActiveNoteId(parsed[0].id)
          setIsLoaded(true)
          return
        }
      }
    } catch (e) {
      console.error('Failed to load notes from localStorage', e)
    }
    setNotes(INITIAL_NOTES)
    if (INITIAL_NOTES[0]) {
      setActiveNoteId(INITIAL_NOTES[0].id)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
      } catch (e) {
        console.error('Failed to save notes to localStorage', e)
      }
    }
  }, [notes, isLoaded])

  // Quick capture note
  const captureNote = useCallback((input: QuickCaptureInput) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: input.title || 'Untitled Quick Capture',
      content: input.content,
      category: input.category,
      type: input.type || 'note',
      projectName: input.projectName || 'General',
      credentialData: input.credentialData,
      tags: input.tags.length > 0 ? input.tags : ['quick-cap'],
      status: 'active',
      priority: input.priority || 'medium',
      isPinned: input.isPinned || false,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        wordCount: input.content.split(/\s+/).filter(Boolean).length
      }
    }
    setNotes(prev => [newNote, ...prev])
    setActiveNoteId(newNote.id)
    return newNote
  }, [])

  // Update existing note
  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? {
              ...n,
              ...updates,
              updatedAt: new Date().toISOString(),
              ...(updates.content
                ? {
                    metadata: {
                      ...n.metadata,
                      wordCount: updates.content.split(/\s+/).filter(Boolean).length
                    }
                  }
                : {})
            }
          : n
      )
    )
  }, [])

  // Delete note
  const deleteNote = useCallback((id: string) => {
    setNotes(prev => {
      const next = prev.filter(n => n.id !== id)
      if (activeNoteId === id && next.length > 0 && next[0]) {
        setActiveNoteId(next[0].id)
      }
      return next
    })
  }, [activeNoteId])

  // Toggle Pinned
  const togglePin = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    )
  }, [])

  // Toggle Favorite
  const toggleFavorite = useCallback((id: string) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, isFavorite: !n.isFavorite } : n))
    )
  }, [])

  // Filtered notes list (Rapid Retrieval)
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Query search
      if (filter.query.trim()) {
        const q = filter.query.toLowerCase()
        const titleMatch = note.title.toLowerCase().includes(q)
        const contentMatch = note.content.toLowerCase().includes(q)
        const tagMatch = note.tags.some(t => t.toLowerCase().includes(q))
        const projectMatch = note.projectName?.toLowerCase().includes(q)
        const credentialMatch =
          note.credentialData?.username?.toLowerCase().includes(q) ||
          note.credentialData?.secret?.toLowerCase().includes(q)
        if (!titleMatch && !contentMatch && !tagMatch && !projectMatch && !credentialMatch) return false
      }
      // Category filter
      if (filter.category !== 'all' && note.category !== filter.category) {
        return false
      }
      // Type filter
      if (filter.selectedType !== 'all' && note.type !== filter.selectedType) {
        return false
      }
      // Project filter
      if (filter.selectedProject && note.projectName !== filter.selectedProject) {
        return false
      }
      // Tag filter
      if (filter.selectedTag && !note.tags.includes(filter.selectedTag)) {
        return false
      }
      // Status filter
      if (filter.status !== 'all' && note.status !== filter.status) {
        return false
      }
      // Pinned filter
      if (filter.onlyPinned && !note.isPinned) return false
      // Favorite filter
      if (filter.onlyFavorites && !note.isFavorite) return false

      return true
    }).sort((a, b) => {
      // Pinned first, then newest
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [notes, filter])

  // All extracted unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    notes.forEach(n => n.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet)
  }, [notes])

  // All extracted unique projects
  const allProjects = useMemo(() => {
    const projectSet = new Set<string>()
    notes.forEach(n => {
      if (n.projectName) projectSet.add(n.projectName)
    })
    return Array.from(projectSet)
  }, [notes])

  // Extracted Top Projects with count & NoteTypes
  const topProjects = useMemo(() => {
    const map = new Map<string, { count: number; types: Set<NoteType> }>()
    notes.forEach(n => {
      const p = n.projectName || 'General'
      if (!map.has(p)) {
        map.set(p, { count: 0, types: new Set() })
      }
      const item = map.get(p)!
      item.count += 1
      if (n.type) item.types.add(n.type)
    })

    return Array.from(map.entries())
      .map(([name, stat]) => ({
        name,
        count: stat.count,
        types: Array.from(stat.types)
      }))
      .sort((a, b) => b.count - a.count)
  }, [notes])

  // Selected note
  const activeNote = useMemo(() => {
    return notes.find(n => n.id === activeNoteId) || filteredNotes[0] || null
  }, [notes, activeNoteId, filteredNotes])

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K & Cmd+J)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsRetrievalModalOpen(prev => !prev)
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault()
        setIsCaptureModalOpen(prev => !prev)
      }
      if (e.key === 'Escape') {
        setIsCaptureModalOpen(false)
        setIsRetrievalModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return {
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
    resetNotes: () => {
      setNotes(INITIAL_NOTES)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTES))
    }
  }
}
