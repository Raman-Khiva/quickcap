'use client'

import React, { useState } from 'react'
import { Zap, X, Sparkles, Code, FileSpreadsheet, ListTodo, Mic, Key, Folder } from 'lucide-react'
import { NoteCategory, NotePriority, NoteType, QuickCaptureInput } from '@/lib/types/note'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Textarea } from '@workspace/ui/components/textarea'
import { Badge } from '@workspace/ui/components/badge'
import { NoteTypeIcon } from '@/components/note-type-icon'

interface QuickCaptureModalProps {
  isOpen: boolean
  onClose: () => void
  onCapture: (input: QuickCaptureInput) => void
}

export function QuickCaptureModal({
  isOpen,
  onClose,
  onCapture
}: QuickCaptureModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<NoteType>('note')
  const [projectName, setProjectName] = useState('Project QuickCap')
  const [category, setCategory] = useState<NoteCategory>('planning')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(['quick-cap'])
  const [priority, setPriority] = useState<NotePriority>('medium')
  const [isPinned, setIsPinned] = useState(false)

  // Credential extra fields
  const [username, setUsername] = useState('')
  const [secret, setSecret] = useState('')

  if (!isOpen) return null

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() && !title.trim()) return

    onCapture({
      title: title.trim() || 'Quick Capture',
      content,
      type,
      projectName: projectName.trim() || 'General',
      credentialData: type === 'credential' ? { username, secret } : undefined,
      category,
      tags,
      priority,
      isPinned
    })

    // Reset form
    setTitle('')
    setContent('')
    setUsername('')
    setSecret('')
    setTags(['quick-cap'])
    onClose()
  }

  const applyTemplate = (tmpl: 'credential' | 'code' | 'meeting' | 'task' | 'memo') => {
    switch (tmpl) {
      case 'credential':
        setTitle('Production Database Credentials')
        setContent('Host: db.quickcap.internal\nPort: 5432\nDatabase: production_main')
        setType('credential')
        setUsername('admin_role')
        setSecret('sk_live_db_998273461')
        setCategory('account')
        setTags(['credentials', 'db', 'security'])
        break
      case 'code':
        setTitle('Client-Side Vector Index')
        setContent('const index = createFuzzyIndex(notes)\nconst results = index.search(query)')
        setType('code')
        setCategory('scratchpad')
        setTags(['code', 'typescript', 'architecture'])
        break
      case 'meeting':
        setTitle('Sprint Architecture Sync')
        setContent('Attendees:\n- Raman\n- Team\n\nAgenda:\n1. Note type color box styling\n2. Rapid credential vault 1-click copy')
        setType('meeting')
        setCategory('overview')
        setTags(['meeting', 'sync'])
        break
      case 'task':
        setTitle('UX Refinement Checklist')
        setContent('- [ ] Verify solid color box design for type icons\n- [ ] Ensure full screen layout\n- [ ] Audit typecheck')
        setType('checklist')
        setCategory('planning')
        setTags(['tasks', 'checklist'])
        break
      case 'memo':
        setTitle('Voice Note: Icon Color Shading')
        setContent('Audio Memo (0:30):\n"Give icon a color and create a solid box with a lighter shade of that same color around it."')
        setType('voice')
        setCategory('ideas')
        setTags(['voice-memo', 'design'])
        break
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      <Card className="w-full max-w-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-zinc-900 text-white flex items-center justify-center dark:bg-zinc-100 dark:text-zinc-900">
                <Zap className="size-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  Quick Capture
                  <Badge variant="amber" size="sm" dotColor="amber">Rapid Entry</Badge>
                </CardTitle>
                <p className="text-xs text-zinc-400">Capture thoughts, tasks, and credentials instantly</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </CardHeader>

          <CardContent className="space-y-3 pt-2">
            {/* Template Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
              <span className="text-zinc-400 font-medium shrink-0 flex items-center gap-1">
                <Sparkles className="size-3 text-amber-500" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => applyTemplate('credential')}
                className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[0.72rem] font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer dark:bg-emerald-950/60 dark:text-emerald-300"
              >
                <Key className="size-3" /> Credential
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('code')}
                className="px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[0.72rem] font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer dark:bg-indigo-950/60 dark:text-indigo-300"
              >
                <Code className="size-3" /> Code
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('meeting')}
                className="px-2.5 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-800 text-[0.72rem] font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer dark:bg-purple-950/60 dark:text-purple-300"
              >
                <FileSpreadsheet className="size-3" /> Meeting
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('task')}
                className="px-2.5 py-1 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 text-[0.72rem] font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer dark:bg-sky-950/60 dark:text-sky-300"
              >
                <ListTodo className="size-3" /> Task
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('memo')}
                className="px-2.5 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-800 text-[0.72rem] font-medium transition-colors shrink-0 flex items-center gap-1 cursor-pointer dark:bg-rose-950/60 dark:text-rose-300"
              >
                <Mic className="size-3" /> Voice
              </button>
            </div>

            {/* Note Type & Project Selector Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[0.7rem] font-semibold text-zinc-500 block mb-1 uppercase tracking-wider">
                  Note Type & Style Box
                </label>
                <div className="flex items-center gap-2">
                  <NoteTypeIcon type={type} size="md" />
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as NoteType)}
                    className="flex-1 h-9 rounded-xl bg-zinc-100/80 px-3 text-xs font-medium text-zinc-900 border border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:bg-zinc-900 cursor-pointer"
                  >
                    <option value="note">Document / Note</option>
                    <option value="credential">🔑 Credential / Key</option>
                    <option value="code">💻 Code Snippet</option>
                    <option value="finance">💳 Finance & Payout</option>
                    <option value="meeting">👥 Meeting Note</option>
                    <option value="checklist">☑️ Checklist / Todo</option>
                    <option value="voice">🎙️ Voice Memo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[0.7rem] font-semibold text-zinc-500 block mb-1 uppercase tracking-wider">
                  Project Network
                </label>
                <Input
                  value={projectName}
                  onChange={e => setProjectName(e.target.value)}
                  placeholder="Project Name..."
                  icon={<Folder className="size-3 text-zinc-400" />}
                  className="h-9 text-xs rounded-xl bg-zinc-100/80 dark:bg-zinc-800"
                />
              </div>
            </div>

            {/* Credential Quick Input Box (If Credential type selected) */}
            {type === 'credential' && (
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
                <span className="text-[0.68rem] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block">
                  Credential Vault Quick Input
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username / Email..."
                    className="h-8 text-xs font-mono rounded-lg bg-white dark:bg-zinc-900 border-emerald-200/60 dark:border-emerald-900/60"
                  />
                  <Input
                    type="text"
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                    placeholder="Secret Key / Token..."
                    className="h-8 text-xs font-mono rounded-lg bg-white dark:bg-zinc-900 border-emerald-200/60 dark:border-emerald-900/60"
                  />
                </div>
              </div>
            )}

            {/* Note Title */}
            <div>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Title (e.g., Stellar API Bearer Token)..."
                className="text-sm font-semibold rounded-xl bg-zinc-100/80 border-transparent focus:bg-white dark:bg-zinc-800 dark:focus:bg-zinc-900"
                autoFocus
              />
            </div>

            {/* Note Content */}
            <div>
              <Textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Content details, markdown, snippet..."
                className="min-h-[110px] text-xs font-mono rounded-xl bg-zinc-100/80 border-transparent focus:bg-white dark:bg-zinc-800 dark:focus:bg-zinc-900"
              />
            </div>

            {/* Tags Input */}
            <div>
              <div className="flex items-center gap-2">
                <Input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="Add tags (press Enter)..."
                  className="text-xs h-8 rounded-xl bg-zinc-100/80 dark:bg-zinc-800"
                />
                <Button
                  type="button"
                  variant="pillSecondary"
                  size="xs"
                  onClick={handleAddTag}
                  className="shrink-0 h-8 px-3"
                >
                  Add Tag
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {tags.map(t => (
                    <Badge
                      key={t}
                      variant="secondary"
                      size="sm"
                      className="gap-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700"
                      onClick={() => handleRemoveTag(t)}
                    >
                      #{t} <X className="size-2.5 text-zinc-400" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3 pb-3">
            <label className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 cursor-pointer">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={e => setIsPinned(e.target.checked)}
                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
              />
              Pin to top
            </label>

            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="pill" size="sm" className="px-5">
                Capture Note ↵
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
