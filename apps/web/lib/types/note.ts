export type NoteCategory = 'planning' | 'support' | 'overview' | 'account' | 'ideas' | 'scratchpad'

export type NotePriority = 'low' | 'medium' | 'high'

export type NoteStatus = 'active' | 'pending' | 'completed' | 'archived'

export type NoteType = 'note' | 'credential' | 'checklist' | 'meeting' | 'code' | 'voice' | 'finance'

export interface CredentialData {
  username?: string
  secret?: string
  url?: string
}

export interface Note {
  id: string
  title: string
  content: string
  category: NoteCategory
  type: NoteType
  projectName?: string
  credentialData?: CredentialData
  tags: string[]
  status: NoteStatus
  priority: NotePriority
  isPinned: boolean
  isFavorite: boolean
  createdAt: string
  updatedAt: string
  metadata?: {
    estimatedTime?: string
    wordCount?: number
    author?: string
    audioMemoLength?: string
    codeSnippetLanguage?: string
  }
}

export interface QuickCaptureInput {
  title: string
  content: string
  category: NoteCategory
  type: NoteType
  projectName?: string
  credentialData?: CredentialData
  tags: string[]
  priority: NotePriority
  isPinned?: boolean
}

export interface SearchFilter {
  query: string
  category: NoteCategory | 'all'
  selectedType: NoteType | 'all'
  selectedProject: string | null
  selectedTag: string | null
  status: NoteStatus | 'all'
  onlyPinned: boolean
  onlyFavorites: boolean
}
